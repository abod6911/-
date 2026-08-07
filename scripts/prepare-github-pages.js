import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputPublicDir = path.join(rootDir, ".output", "public");
const distDir = path.join(rootDir, "dist");

// Reset dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy .output/public contents to dist
if (fs.existsSync(outputPublicDir)) {
  fs.cpSync(outputPublicDir, distDir, { recursive: true });
}

// Find compiled styles and index JS
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
    <div id="root">
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #FAF6F0; color: #252A28; font-family: system-ui, sans-serif; direction: rtl; text-align: center; padding: 20px;">
        <div style="width: 64px; height: 64px; border-radius: 20px; background-color: #C96745; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(201, 103, 69, 0.35); margin-bottom: 14px;">
          <span style="font-size: 30px; font-weight: 900; color: #ffffff;">جـ</span>
        </div>
        <h1 style="font-size: 20px; font-weight: 900; margin: 0 0 4px 0; color: #252A28;">جِدّاو | JEDDAW</h1>
        <p style="font-size: 13px; font-weight: 700; color: #6E716C; margin: 0 0 20px 0;">جدة تبدأ من هنا 🌊</p>
        <div style="width: 28px; height: 28px; border: 3px solid #E2D3BE; border-top-color: #C96745; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
      </div>
    </div>
    ${jsFile ? `<script type="module" src="./assets/${jsFile}"></script>` : ""}
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, "index.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, "404.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, ".nojekyll"), "", "utf-8");

console.log("Successfully prepared static distribution for GitHub Pages in dist/");
