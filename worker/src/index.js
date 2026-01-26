/**
 * Cloudflare Worker: /api/youtube/popular?limit=12
 * - Fetches uploads from @behavioraleconomicstoday, then sorts by viewCount desc.
 * - Uses caches.default to cache responses for 6 hours.
 *
 * Required secret:
 * - YOUTUBE_API_KEY
 *
 * Route this Worker to:
 * - hughmassie.com/api/*
 */

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;
const CACHE_TTL_SECONDS = 60 * 60 * 6; // 6 hours

const HANDLE = "behavioraleconomicstoday"; // from https://youtube.com/@behavioraleconomicstoday

function jsonResponse(data, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
    ...extraHeaders,
  });
  return new Response(JSON.stringify(data, null, 2), { status, headers });
}

function clampLimit(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(n), MAX_LIMIT);
}

function formatDuration(iso) {
  // ISO8601 duration like PT1H2M3S, PT12M34S, PT45S
  if (!iso || typeof iso !== "string") return null;
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return null;
  const h = Number(m[1] || 0);
  const min = Number(m[2] || 0);
  const s = Number(m[3] || 0);

  const total = h * 3600 + min * 60 + s;
  if (!Number.isFinite(total)) return null;

  const pad2 = (x) => String(x).padStart(2, "0");
  if (h > 0) return `${h}:${pad2(min)}:${pad2(s)}`;
  return `${min}:${pad2(s)}`;
}

async function ytFetch(url, apiKey) {
  const u = new URL(url);
  u.searchParams.set("key", apiKey);

  const res = await fetch(u.toString(), {
    headers: { "Accept": "application/json" },
  });

  // YouTube often returns JSON with error details
  const body = await res.text();
  let parsed = null;
  try {
    parsed = JSON.parse(body);
  } catch {
    // leave null
  }

  if (!res.ok) {
    const message =
      parsed?.error?.message ||
      `YouTube API error: ${res.status} ${res.statusText}`;
    const reason = parsed?.error?.errors?.[0]?.reason || null;
    throw new Error(reason ? `${message} (${reason})` : message);
  }

  return parsed;
}

async function resolveChannelId(apiKey) {
  // 1) Prefer forHandle if supported
  try {
    const data = await ytFetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(
        HANDLE
      )}`,
      apiKey
    );
    const id = data?.items?.[0]?.id;
    if (id) return id;
  } catch {
    // ignore and fallback
  }

  // 2) Fallback to search
  const search = await ytFetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=5&q=${encodeURIComponent(
      HANDLE
    )}`,
    apiKey
  );

  // Pick the most relevant first item
  const id = search?.items?.[0]?.snippet?.channelId;
  if (!id) throw new Error("Could not resolve YouTube channelId from handle.");
  return id;
}

async function getUploadsPlaylistId(channelId, apiKey) {
  const data = await ytFetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${encodeURIComponent(
      channelId
    )}`,
    apiKey
  );

  const uploads =
    data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null;

  const channelTitle = data?.items?.[0]?.snippet?.title || null;

  if (!uploads) throw new Error("Could not find uploads playlist for channel.");
  return { uploadsPlaylistId: uploads, channelTitle };
}

async function getRecentVideoIdsFromUploads(uploadsPlaylistId, apiKey) {
  // Pull up to 50 newest uploads, then we will sort by viewCount
  const data = await ytFetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${encodeURIComponent(
      uploadsPlaylistId
    )}`,
    apiKey
  );

  const ids =
    data?.items
      ?.map((it) => it?.contentDetails?.videoId)
      ?.filter(Boolean) || [];

  // Deduplicate
  return Array.from(new Set(ids));
}

async function getVideoDetails(videoIds, apiKey) {
  // videos endpoint limit is 50 IDs per request
  const chunks = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  const results = [];
  for (const chunk of chunks) {
    const data = await ytFetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${encodeURIComponent(
        chunk.join(",")
      )}`,
      apiKey
    );

    const items = data?.items || [];
    for (const v of items) {
      const videoId = v?.id;
      if (!videoId) continue;

      const title = v?.snippet?.title || "";
      const publishedAt = v?.snippet?.publishedAt || null;

      // Prefer higher-res thumbs if present
      const thumbs = v?.snippet?.thumbnails || {};
      const thumbnailUrl =
        thumbs?.maxres?.url ||
        thumbs?.standard?.url ||
        thumbs?.high?.url ||
        thumbs?.medium?.url ||
        thumbs?.default?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      const viewCount = Number(v?.statistics?.viewCount || 0);
      const durationIso = v?.contentDetails?.duration || null;
      const duration = formatDuration(durationIso);

      results.push({
        videoId,
        title,
        publishedAt,
        thumbnailUrl,
        viewCount,
        duration,
      });
    }
  }

  return results;
}

async function buildPopularResponse(apiKey, limit) {
  const channelId = await resolveChannelId(apiKey);
  const { uploadsPlaylistId, channelTitle } = await getUploadsPlaylistId(
    channelId,
    apiKey
  );
  const recentVideoIds = await getRecentVideoIdsFromUploads(
    uploadsPlaylistId,
    apiKey
  );

  if (recentVideoIds.length === 0) {
    return {
      channel: channelTitle || "Behavioral Economics Today",
      items: [],
      cachedAt: new Date().toISOString(),
    };
  }

  const details = await getVideoDetails(recentVideoIds, apiKey);

  // Sort by viewCount desc
  details.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

  return {
    channel: channelTitle || "Behavioral Economics Today",
    items: details.slice(0, limit),
    cachedAt: new Date().toISOString(),
  };
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // Common CORS headers
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      };

      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
      }

      // Root path health check
      if (url.pathname === "/" || url.pathname === "") {
        return new Response("Worker is running. Endpoint: /api/youtube/popular", { 
            status: 200, 
            headers: corsHeaders 
        });
      }

      // Only handle the API route you want
      if (url.pathname !== "/api/youtube/popular") {
        return new Response("Not found", { status: 404, headers: corsHeaders });
      }

      if (request.method !== "GET") {
        return new Response("Method not allowed", { status: 405, headers: corsHeaders });
      }

      const apiKey = env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return jsonResponse(
          { error: "Missing YOUTUBE_API_KEY secret in Worker environment." },
          500
        );
      }

      const limit = clampLimit(url.searchParams.get("limit"));

      // Cache key should vary by limit
      const cacheUrl = new URL(request.url);
      cacheUrl.searchParams.set("limit", String(limit));
      const cacheKey = new Request(cacheUrl.toString(), request);

      const cache = caches.default;
      const cached = await cache.match(cacheKey);
      if (cached) return cached;

      const payload = await buildPopularResponse(apiKey, limit);

      const res = jsonResponse(payload, 200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      });

      // Store in Cloudflare edge cache
      ctx.waitUntil(cache.put(cacheKey, res.clone()));

      return res;
    } catch (err) {
      return jsonResponse(
        {
          error: "Failed to build popular videos feed.",
          detail: err instanceof Error ? err.message : String(err),
        },
        500
      );
    }
  },
};
