import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const rootAssetsDir = path.join(rootDir, "assets");

if (fs.existsSync(rootAssetsDir)) {
  fs.rmSync(rootAssetsDir, { recursive: true, force: true });
  console.log("Cleaned root assets folder before build.");
}
