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

// Copy public/new-site.html to dist and root
const newSiteHtmlSource = path.join(rootDir, "public", "new-site.html");
if (fs.existsSync(newSiteHtmlSource)) {
  fs.copyFileSync(newSiteHtmlSource, path.join(distDir, "new-site.html"));
  fs.copyFileSync(newSiteHtmlSource, path.join(rootDir, "new-site.html"));
}

// Mobile App Standalone Source Path
const mobileAppHtmlSource = path.join(rootDir, "public", "mobile-app.html");
let mobileAppContent = "";

if (fs.existsSync(mobileAppHtmlSource)) {
  mobileAppContent = fs.readFileSync(mobileAppHtmlSource, "utf-8");
}

const finalHtmlContent = mobileAppContent;

// Write to all possible GitHub Pages targets
fs.writeFileSync(path.join(distDir, "index.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, "mobile-app.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, "404.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(distDir, ".nojekyll"), "", "utf-8");

fs.writeFileSync(path.join(rootDir, "index.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, "mobile-app.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, "404.html"), finalHtmlContent, "utf-8");
fs.writeFileSync(path.join(rootDir, ".nojekyll"), "", "utf-8");

// Sync assets folder if exists
const assetsDir = path.join(distDir, "assets");
if (fs.existsSync(assetsDir)) {
  if (fs.existsSync(rootAssetsDir)) {
    fs.rmSync(rootAssetsDir, { recursive: true, force: true });
  }
  fs.cpSync(assetsDir, rootAssetsDir, { recursive: true });
}

const headersContent = `/*
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0`;

fs.writeFileSync(path.join(distDir, "_headers"), headersContent, "utf-8");
fs.writeFileSync(path.join(rootDir, "_headers"), headersContent, "utf-8");

console.log("Successfully deployed brand new standalone website!");
