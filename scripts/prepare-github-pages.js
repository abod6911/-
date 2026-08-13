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

const finalHtmlContent = mobileAppContent || `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>جِدّاو | JEDDAW — تطبيق طلعات جدة المخصص للجوال</title>
  </head>
  <body><div id="root"></div></body>
</html>
`;

// Write to all possible GitHub Pages targets
fs.writeFileSync(path.join(distDir, "index.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, "mobile-app.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, "404.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, ".nojekyll"), "", "utf-8");

fs.writeFileSync(path.join(rootDir, "index.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, "mobile-app.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, "404.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, ".nojekyll"), "", "utf-8");

// Sync assets folder
if (fs.existsSync(assetsDir)) {
  if (fs.existsSync(rootAssetsDir)) {
    fs.rmSync(rootAssetsDir, { recursive: true, force: true });
  }
  fs.cpSync(assetsDir, rootAssetsDir, { recursive: true });
}

// Copy public logo if exists
const publicLogoPng = path.join(rootDir, "public", "jeddaw-logo.png");
if (fs.existsSync(publicLogoPng)) {
  fs.copyFileSync(publicLogoPng, path.join(distDir, "jeddaw-logo.png"));
  fs.copyFileSync(publicLogoPng, path.join(rootDir, "jeddaw-logo.png"));
}

const headersContent = `/*
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0`;

fs.writeFileSync(path.join(distDir, "_headers"), headersContent, "utf-8");
fs.writeFileSync(path.join(rootDir, "_headers"), headersContent, "utf-8");

console.log("Successfully deployed Mobile Web App to all GitHub Pages targets (index.html, mobile-app.html, 404.html)!");
