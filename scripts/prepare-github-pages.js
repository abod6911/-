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
    <title>وش الخطة؟ | Wesh Alkhutta — جدة</title>
    <link rel="icon" type="image/x-icon" href="./favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    ${cssFile ? `<link rel="stylesheet" href="./assets/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="./assets/${jsFile}"></script>` : ""}
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, "index.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, "404.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, ".nojekyll"), "", "utf-8");

console.log("Successfully prepared static distribution for GitHub Pages in dist/");
