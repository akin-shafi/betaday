const fs = require("fs");
const path = require("path");

const PAGES_DIR = path.join(process.cwd(), "src/app");

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Skip if already has "use client"
  if (content.includes('"use client"')) {
    return;
  }

  // Add "use client" directive at the top
  const newContent = '"use client";\n\n' + content;

  fs.writeFileSync(filePath, newContent);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file === "page.tsx" || file === "page.jsx") {
      processFile(filePath);
    }
  });
}

// Start processing from the pages directory
walkDir(PAGES_DIR);

console.log("Finished processing all pages.");
