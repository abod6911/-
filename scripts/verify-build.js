import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distIndex = path.join(rootDir, "dist", "index.html");

if (!fs.existsSync(distIndex)) {
  console.error("❌ BUILD ERROR: dist/index.html does not exist!");
  process.exit(1);
}

const html = fs.readFileSync(distIndex, "utf-8");

// Viewport assertions
const metaMatches = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/gi) || [];

if (metaMatches.length !== 1) {
  console.error(`❌ BUILD ERROR: Expected exactly 1 viewport meta tag in dist/index.html, found ${metaMatches.length}`);
  process.exit(1);
}

const viewportTag = metaMatches[0] || "";

if (viewportTag.includes("user-scalable=no")) {
  console.error("❌ BUILD ERROR: Viewport meta tag contains prohibited 'user-scalable=no'");
  process.exit(1);
}

if (viewportTag.includes("maximum-scale")) {
  console.error("❌ BUILD ERROR: Viewport meta tag contains prohibited 'maximum-scale'");
  process.exit(1);
}

if (viewportTag.includes("interactive-widget")) {
  console.error("❌ BUILD ERROR: Viewport meta tag contains prohibited 'interactive-widget'");
  process.exit(1);
}

console.log("✅ BUILD VERIFICATION SUCCESS: dist/index.html passed all viewport assertions!");
