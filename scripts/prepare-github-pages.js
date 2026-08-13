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

// Mobile App Standalone Source Path
const mobileAppHtmlSource = path.join(rootDir, "public", "mobile-app.html");
let mobileAppContent = "";

if (fs.existsSync(mobileAppHtmlSource)) {
  mobileAppContent = fs.readFileSync(mobileAppHtmlSource, "utf-8");
}

// Default to Mobile Touch App Content if available for 100% phone freeze immunity
const indexHtmlContent = mobileAppContent || `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <title>جِدّاو | JEDDAW — جدة تبدأ من هنا</title>
    ${cssFile ? `<link rel="stylesheet" href="./assets/${cssFile}?v=${Date.now()}" />` : ""}
    ${jsFile ? `<link rel="modulepreload" href="./assets/${jsFile}?v=${Date.now()}" />` : ""}
  </head>
  <body class="bg-[#FAF6F0] dark:bg-[#121817] text-[#252A28] dark:text-[#F5F1E8]">
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="./assets/${jsFile}?v=${Date.now()}"></script>` : ""}
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
const publicLogoPng = path.join(rootDir, "public", "jeddaw-logo.png");
if (fs.existsSync(publicLogoPng)) {
  fs.copyFileSync(publicLogoPng, path.join(distDir, "jeddaw-logo.png"));
  fs.copyFileSync(publicLogoPng, path.join(rootDir, "jeddaw-logo.png"));
}

const publicLogoWebp = path.join(rootDir, "public", "jeddaw-logo.webp");
if (fs.existsSync(publicLogoWebp)) {
  fs.copyFileSync(publicLogoWebp, path.join(distDir, "jeddaw-logo.webp"));
  fs.copyFileSync(publicLogoWebp, path.join(rootDir, "jeddaw-logo.webp"));
}

const headersContent = `/*
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0`;

fs.writeFileSync(path.join(rootDir, "index.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, "404.html"), indexHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, ".nojekyll"), "", "utf-8");
fs.writeFileSync(path.join(distDir, "_headers"), headersContent, "utf-8");
fs.writeFileSync(path.join(rootDir, "_headers"), headersContent, "utf-8");

console.log("Successfully deployed pure Touch-Native Mobile Web App to root index.html!");
