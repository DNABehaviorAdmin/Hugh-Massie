# Hugh Massie Portfolio - Developer Guide

**Current Version:** 2.0 (Local Build)
**Last Updated:** January 2026

> **New to Coding?** Scroll down to **Section 1: Quick Start for Beginners** to get started without any prior experience.

---

## 1. Quick Start for Beginners (Interns/Non-Developers)
If you are an intern or data analyst jumping into this for the first time, follow these exact steps.

### Step A: Install the Tools
You need two pieces of software to work on this site:
1.  **VS Code** (The text editor): [Download here](https://code.visualstudio.com/download). Install it with default settings.
2.  **Node.js** (The tool that builds the styles): [Download here](https://nodejs.org/en/download/prebuilt-installer). Download the **LTS (Long Term Support)** version.
    *   *Important*: After installing Node.js, restart your computer to ensure it works in the terminal.

### Step B: Open the Project
1.  Open **VS Code**.
2.  Go to `File > Open Folder...` and select the `Hugh Massie` folder.
3.  You will see the files listed on the left side.

### Step C: The "Terminal"
We use a command line to make the styling work.
1.  In VS Code, look at the top menu bar. Click `Terminal > New Terminal`.
2.  A panel will open at the bottom.
3.  Type this exact command and press Enter:
    ```bash
    npm install
    ```
    *(If you see a lot of text scrolling, that's good! It's downloading the tools.)*

### Step D: Making Changes
-   **To change text/images**: Double-click `index.html` on the left. Find the text you want to change (drag the scrollbar or press Ctrl+F to search). Save the file (`Ctrl+S`).
-   **To change colors/layout**: You need the "Styling Engine" running. In the terminal, type:
    ```bash
    npx tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --watch
    ```
    *Leave this running while you work. It will automatically update the site design when you save.*

---

## 2. Technical Overview
This is a premium, single-page portfolio website for **Hugh Massie**, Executive Chairman & Founder of DNA Behavior. It features a modern dark-themed design with scrolling parallax effects, canvas particle animations, and high-performance interactions.

**Tech Stack:**
-   **HTML5 / Vanilla JavaScript**: Core structure and logic.
-   **Tailwind CSS (Local CLI)**: Styling engine (migrated from CDN for security/performance).
-   **Canvas API**: Custom particle background (`assets/js/script.js`).
-   **Node.js**: Used only for the Tailwind CSS build process.

---

## 3. Setup & Installation (Advanced)
This project does **not** rely on a complex bundler like Webpack or Vite for the runtime. It uses a simple static file structure, but requires a build step for CSS.

### Prerequisites
-   **Node.js** (v18+ recommended)
-   **Git**

### Installation Steps
1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Install Dependencies** (for Tailwind CSS):
    ```bash
    npm install
    ```
    *This installs `tailwindcss` and any plugins defined in `package.json`.*

---

## 4. Development Workflow (Standard)

### css
To make changes to styles, you must edit `assets/css/input.css` or use Tailwind utility classes in `index.html`. 

**Start the CSS Watcher:**
Run this command to automatically rebuild `output.css` whenever you save changes:
```bash
npx tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --watch
```

### HTML & JS
-   Open `index.html` with **Live Server** (VS Code Extension) or simply drag it into your browser.
-   **Note**: The site refers to `assets/css/output.css`. **Do not edit `output.css` directly**; it will be overwritten.

---

## 5. Project Structure

```text
/
├── index.html              # Main HTML file (SEO meta, structure, content)
├── package.json            # Node dependencies (Tailwind)
├── tailwind.config.js      # Tailwind configuration (colors, fonts, theme extensions)
├── assets/
│   ├── css/
│   │   ├── input.css       # Source CSS (Custom styles, animations, @tailwind directives)
│   │   └── output.css      # Generated/Compiled Class file (DO NOT EDIT)
│   ├── js/
│   │   └── script.js       # Main logic (Scroll, Particles, UI interactions)
│   ├── downloads/          # PDF files (e.g., DNAB_Leadership_Book.pdf)
│   └── ... (images)
└── favicons/               # Site icons
```

---

## 6. Key Customization Guide

### Changing Content
Edit `index.html`. The semantic tags (`<section id="about">`, etc.) make it easy to locate specific areas.

### Updating the PDF Download
1.  Place the new PDF in `assets/downloads/`.
2.  **Important**: Rename the file to remove spaces (e.g., `My_New_Book.pdf`) to avoid URL issues.
3.  Update the `href` and `download` attributes in `index.html`:
    ```html
    <a href="assets/downloads/My_New_Book.pdf" download="My_New_Book.pdf" ...>
    ```
    *Note: There are two download buttons (Hero section and Key Work section).*

### Modifying the Theme (Colors)
Colors are defined in `tailwind.config.js`:
-   `navy`: Background (`#0f172a`)
-   `accent`: Teal (`#2dd4bf`) - used for primary highlights.
-   `accent-purple`: Purple (`#a78bfa`)
-   `accent-blue`: Blue (`#60a5fa`)

Change these hex values and re-run the CSS build command to update the entire site theme.

### Performance Logic (`script.js`)
-   **Scroll Handling**: All scroll events are throttled via `requestAnimationFrame` in the `onScroll()` function.
-   **Animations**: Spotlight cards and particles use optimized coordinate caching. if adding new interactive elements, ensure you cache their dimensions (don't call `getBoundingClientRect` inside a loop).

---

## 7. Deployment
This site is a **Static Website**.
-   **GitHub Pages**: Push to `main` (or `gh-pages` branch). Ensure "Source" is set to the root folder.
-   **Netlify/Vercel**: Connect the repo. Build command is empty (or `npm run build` if you add a script). Publish directory is `/` (root).

**Security**:
The `Content-Security-Policy` meta tag in `index.html` restricts where scripts/styles can load from. If you add external scripts (e.g., Google Analytics), you must update this policy.
