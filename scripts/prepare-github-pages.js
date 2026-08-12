import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputPublicDir = path.join(rootDir, ".output", "public");
const distDir = path.join(rootDir, "dist");
const rootAssetsDir = path.join(rootDir, "assets");

// Reset dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy .output/public contents to dist
if (fs.existsSync(outputPublicDir)) {
  fs.cpSync(outputPublicDir, distDir, { recursive: true });
}

// Find compiled styles and index JS inside dist/assets
const assetsDir = path.join(distDir, "assets");
let cssFile = "";
let jsFile = "";

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css")) || "";
  jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js")) || "";
}

console.log(`Found CSS asset: ${cssFile}`);
console.log(`Found JS asset: ${jsFile}`);

const indexHtmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content" />
    <title>جِدّاو | JEDDAW — جدة تبدأ من هنا</title>
    <meta name="description" content="جِدّاو يرتّب لك طلعة كاملة في جدة حسب وقتك وميزانيتك ومودك. اختر موقعك ووقتك، ونرتّب لك الخطة كاملة في أقل من دقيقة." />
    <link rel="icon" type="image/x-icon" href="./favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Manrope:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    <script>
      (function() {
        try {
          var saved = localStorage.getItem("jeddaw_theme") || localStorage.getItem("wesh_theme");
          var isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
          if (isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        } catch (e) {}
      })();
    </script>
    ${cssFile ? `<link rel="stylesheet" href="./assets/${cssFile}" />` : ""}
    ${jsFile ? `<link rel="modulepreload" href="./assets/${jsFile}" />` : ""}
  </head>
  <body class="bg-[#FAF6F0] dark:bg-[#121817] text-[#252A28] dark:text-[#F5F1E8]">
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="./assets/${jsFile}"></script>` : ""}
  </body>
</html>
`;

// Write compiled index.html, 404.html, .nojekyll to dist
fs.writeFileSync(path.join(distDir, "index.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, "404.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, ".nojekyll"), "", "utf-8");

// Also sync root assets folder and root index.html, 404.html, .nojekyll for GitHub Pages root deployment
if (fs.existsSync(assetsDir)) {
  if (fs.existsSync(rootAssetsDir)) {
    fs.rmSync(rootAssetsDir, { recursive: true, force: true });
  }
  fs.cpSync(assetsDir, rootAssetsDir, { recursive: true });
}

// Copy public logo to dist and root if it exists
const publicLogo = path.join(rootDir, "public", "jeddaw-logo.png");
if (fs.existsSync(publicLogo)) {
  fs.copyFileSync(publicLogo, path.join(distDir, "jeddaw-logo.png"));
  fs.copyFileSync(publicLogo, path.join(rootDir, "jeddaw-logo.png"));
}

fs.writeFileSync(path.join(rootDir, "index.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, "404.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, ".nojekyll"), "", "utf-8");

console.log("Successfully prepared static distribution for GitHub Pages in dist/ and root assets!");
