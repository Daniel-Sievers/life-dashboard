const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const exists = file => fs.existsSync(path.join(root, file));
function assert(condition, message) {
  if (!condition) {
    console.error(`✗ ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`✓ ${message}`);
  }
}
const app = read("app.js");
const index = read("index.html");
const css = read("style.css");
const readme = read("README.md");
const sw = exists("service-worker.js") ? read("service-worker.js") : "";
console.log("Life Dashboard smoke check\n");
[
  "index.html",
  "style.css",
  "app.js",
  "manifest.webmanifest",
  "service-worker.js",
  "README.md",
  "package.json",
  "docs/setup.md",
  "docs/architecture.md",
  "docs/privacy.md",
  "docs/screenshots.md",
  "docs/market-data.md",
  "docs/public-release-checklist.md",
  "LICENSE",
  "CHANGELOG.md",
  ".gitignore",
  ".env.example",
  "docs/github.md",
  "docs/vercel.md",
  "docs/license-explained.md",
  "docs/backup.md"
].forEach(file => assert(exists(file), `${file} exists`));
assert(app.includes("public-v26-launch-demo-empty-state"), "SAVE_VERSION is public-v26-launch-demo-empty-state");
assert(css.includes("style.css-public-v26"), "CSS probe is public v26");
assert(index.includes("Life Dashboard"), "index contains Life Dashboard branding");
assert(sw.includes("life-dashboard-public-v26-shell"), "service worker cache is public v26");
assert(app.includes("modularLifeDashboardPublicData"), "public localStorage key is present");
assert(app.includes("modularLifeDashboardPublicEmergencyBackup"), "public emergency backup key is present");
assert(app.includes("modularLifeDashboardPublicDemoProfile"), "public demo profile key is present");
assert(!app.includes("personalDashboardData") && !app.includes("personal-dashboard-v143"), "no private dashboard storage references");
assert(!app.includes("LEGACY_STORAGE_KEYS = [") || app.includes("LEGACY_STORAGE_KEYS = []"), "legacy private migration is disabled");
assert(readme.includes("no backend is required") || readme.includes("no backend required"), "README states no backend is required for the demo");
assert(readme.includes("https://life-dashboard-six-zeta.vercel.app"), "README contains live demo link");
assert(readme.includes("No real API key") || readme.includes("No real API keys"), "README states no real API keys are included");

assert(!exists("backup"), "no backup folder is shipped");
assert(!exists(".git"), "no .git folder is shipped");
assert(!exists("supabase-config.js") && !exists("supabase-setup.sql"), "no Supabase setup files are shipped");
assert(!exists("AUTH_SETUP.md") && !exists("PRIVACY_NOTES.md"), "no internal setup/privacy notes are shipped");
assert(app.includes("PUBLIC_BACKUP_SCHEMA") && app.includes("life-dashboard-public-backup"), "public backup schema is present");
assert(!app.includes("Nicht verkaufen") && !app.includes("nachkaufen"), "legacy private finance notes are not present in app defaults");
assert(!app.match(/sk-[A-Za-z0-9_-]{20,}/), "no obvious OpenAI-style secret key");
assert(!app.match(/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/), "no obvious JWT-like secret token");
assert(app.includes("getDemoData") && app.includes("getStarterDemoProfile") && app.includes("getWealthyDemoProfile"), "multi-demo profile functions exist");
assert(app.includes("refreshPortfolioAssetPrice"), "portfolio price refresh function exists");
assert(app.includes("FX_RATE_CACHE_STORAGE") && app.includes("loadCurrentFxToEUR"), "current FX helper is present");
assert(app.includes("applyDemoProtocolDensity") && app.includes("makeDemoSkillMap"), "richer protocol demo data is present");
assert(index.includes("refreshAssetFx"), "FX refresh button exists");
assert(index.includes("openPortfolioPurchaseAdd"), "global add-purchase button exists");
assert(index.includes('value="" selected>Demo-Profil auswählen …'), "demo profile select starts with neutral placeholder");
assert(index.includes("demoEmptyHint") && index.includes("demoModeCard"), "demo empty-state markup exists");
assert(app.includes("updateDemoEmptyState") && app.includes("Bitte wähle zuerst ein Demo-Profil aus."), "demo empty-state behavior exists");
assert(css.includes("demoAttentionPulse") && css.includes("style.css-public-v26"), "demo attention CSS and v26 probe exist");
assert(!app.includes("Demo-GIF aufnehmen") && !app.includes("Demo-Video aufnehmen"), "demo video/GIF tasks are not seeded");

assert(app.includes("openPortfolioPurchaseEditor"), "purchase-history editor exists");
assert(app.includes("openPortfolioPurchaseAddModal") && app.includes("savePortfolioAdditionalPurchase"), "structured add-purchase flow exists");
if (process.exitCode) {
  console.error("\nSmoke check failed.");
  process.exit(process.exitCode);
}
console.log("\nSmoke check passed.");
