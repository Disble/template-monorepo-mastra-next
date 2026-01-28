#!/usr/bin/env node

/**
 * Postinstall script to patch known issues in dependencies
 *
 * Currently patches:
 * - @mastra/core: Fixes invalid TypeScript identifier '302ai' in provider-types.generated.d.ts
 */

const fs = require("node:fs");
const path = require("node:path");

const PATCHES = [
  {
    name: "@mastra/core provider-types fix",
    pattern:
      "node_modules/.bun/@mastra+core@*/node_modules/@mastra/core/dist/llm/model/provider-types.generated.d.ts",
    search: /readonly 302ai:/g,
    replace: "readonly '302ai':",
  },
];

function findFiles(pattern) {
  try {
    // Use glob to find matching files
    const glob = require("glob");
    return glob.sync(pattern, { cwd: process.cwd() });
  } catch {
    // Fallback: try direct path matching for simple cases
    const baseDir = path.join(process.cwd(), "node_modules/.bun");
    if (!fs.existsSync(baseDir)) return [];

    const files = [];
    const entries = fs.readdirSync(baseDir);
    for (const entry of entries) {
      if (entry.startsWith("@mastra+core@")) {
        const targetFile = path.join(
          baseDir,
          entry,
          "node_modules/@mastra/core/dist/llm/model/provider-types.generated.d.ts",
        );
        if (fs.existsSync(targetFile)) {
          files.push(targetFile);
        }
      }
    }
    return files;
  }
}

function applyPatches() {
  console.log("🔧 Applying dependency patches...\n");

  for (const patch of PATCHES) {
    const files = findFiles(patch.pattern);

    if (files.length === 0) {
      console.log(
        `⏭️  ${patch.name}: No files found (package may not be installed)`,
      );
      continue;
    }

    for (const file of files) {
      try {
        const fullPath = path.isAbsolute(file)
          ? file
          : path.join(process.cwd(), file);
        const content = fs.readFileSync(fullPath, "utf8");

        if (patch.search.test(content)) {
          const patched = content.replace(patch.search, patch.replace);
          fs.writeFileSync(fullPath, patched, "utf8");
          console.log(
            `✅ ${patch.name}: Patched ${path.relative(process.cwd(), fullPath)}`,
          );
        } else {
          console.log(`⏭️  ${patch.name}: Already patched or pattern not found`);
        }
      } catch (err) {
        console.error(`❌ ${patch.name}: Failed to patch ${file}`, err.message);
      }
    }
  }

  console.log("\n✨ Dependency patches complete!");
}

applyPatches();
