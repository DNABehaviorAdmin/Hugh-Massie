export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Adjust to specific domain in production if needed
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    if (path === '/api/youtube/popular') {
      return await handlePopularVideos(request, env, ctx, corsHeaders);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
};

async function handlePopularVideos(request, env, ctx, corsHeaders) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request); // Cache based on full URL including params

  // Check Cache
  let response = await cache.match(cacheKey);
  if (response) {
    console.log('Cache Hit');
    return response;
  }

  console.log('Cache Miss');

  const apiKey = env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing API Key configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const channelHandle = 'behavioraleconomicstoday';
    
    // 1. Get Channel ID and Uploads Playlist ID
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,id&forHandle=${channelHandle}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);
    const channelData = await channelRes.json();

    if (!channelData.items || channelData.items.length === 0) {
        // Fallback search if handle fails (though it shouldn't for this channel)
        throw new Error('Channel not found');
    }

    const channelId = channelData.items[0].id;
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Get Recent Uploads (fetch more than needed to sort by popularity, e.g., 50)
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`;
    const playlistRes = await fetch(playlistUrl);
    const playlistData = await playlistRes.json();

    if (!playlistData.items) {
        return new Response(JSON.stringify({ items: [] }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    // Extract Video IDs
    const videoIds = playlistData.items.map(item => item.contentDetails.videoId).join(',');

    // 3. Get Video Statistics (View Count) and Duration
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${apiKey}`;
    const videosRes = await fetch(videosUrl);
    const videosData = await videosRes.json();

    if (!videosData.items) {
         return new Response(JSON.stringify({ items: [] }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    // 4. Transform and Sort
    const items = videosData.items.map(item => {
        return {
            videoId: item.id,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            thumbnailUrl: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : item.snippet.thumbnails.default.url,
            viewCount: parseInt(item.statistics.viewCount || '0', 10),
            duration: parseDuration(item.contentDetails.duration) // Helper to format ISO8601 duration
        };
    });

    // Sort by View Count Descending
    items.sort((a, b) => b.viewCount - a.viewCount);

    // Limit (default 12)
    const limit = new URL(request.url).searchParams.get('limit') || 12;
    const limitedItems = items.slice(0, parseInt(limit));

    const result = {
        channel: 'Behavioral Economics Today',
        items: limitedItems,
        cachedAt: new Date().toISOString()
    };

    // 5. Construct Response with Cache Headers
    response = new Response(JSON.stringify(result), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=21600', // 6 hours
            ...corsHeaders
        }
    });

    // Write to Cache
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;

  } catch (error) {
    console.error('Worker Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

function parseDuration(isoDuration) {
    // Basic ISO8601 duration parser for PT#M#S
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return isoDuration;

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    let result = '';
    if (hours) result += hours + ':';
    result += (minutes || '0').padStart(hours ? 2 : 1, '0') + ':';
    result += (seconds || '0').padStart(2, '0');

    // If only seconds, format appropriately (e.g. 0:45)
    if (!hours && !minutes) result = '0:' + result;
    
    // If format is like 5:05 (5 mins 5 secs)
    if (!hours && minutes) return `${minutes}:${(seconds||'0').padStart(2,'0')}`;

    return result;
}
