#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Parse command line arguments and optionally prompt for project name
const args = process.argv.slice(2);
let prototypeName = args[0];
const readline = require("readline");

async function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

// Resolve name (prompt if not provided)
async function resolveName() {
  if (!prototypeName) {
    const answer = await askQuestion("Project name: ");
    prototypeName = (answer || "").trim();
    if (!prototypeName) {
      console.error("Error: Project name is required.");
      process.exit(1);
    }
  }
}

// Sanitize prototype name (kebab-case)
function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function main() {
  await resolveName();
  const sanitizedName = toKebabCase(prototypeName);
  const year = new Date().getFullYear().toString();

  // Define paths (by year)
  const useDir = path.join(__dirname, "..", "use");
  const yearDir = path.join(useDir, year);
  const prototypeDir = path.join(yearDir, sanitizedName);

  // Create year directory if it doesn't exist
  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir, { recursive: true });
    console.log(`✓ Created year directory: ${year}/`);
  }

  // Create prototype directory
  if (fs.existsSync(prototypeDir)) {
    console.error(
      `Error: Prototype "${sanitizedName}" already exists in ${year}/`
    );
    process.exit(1);
  }

  fs.mkdirSync(prototypeDir, { recursive: true });
  console.log(`✓ Created prototype directory: ${year}/${sanitizedName}/`);

  // Create .gitignore
  const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
*.local

# Environment
.env
.env.local
.env*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Cache
.cache/
.parcel-cache/
.next/
.nuxt/
`;

  fs.writeFileSync(path.join(prototypeDir, ".gitignore"), gitignoreContent);
  console.log("✓ Created .gitignore");

  // Create README template
  const readmeContent = `# ${sanitizedName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())}

## Description
Brief description of what this prototype demonstrates.

## Year
${year}

## How to Run
\`\`\`bash
# Add setup instructions here
\`\`\`

## Key Learnings
- Learning point 1
- Learning point 2

## Resources
- Link to relevant resources
`;

  fs.writeFileSync(path.join(prototypeDir, "README.md"), readmeContent);
  console.log("✓ Created README.md");

  // Update prototypes.md
  const prototypesMdPath = path.join(useDir, "prototypes.md");
  let prototypesContent = "";

  if (fs.existsSync(prototypesMdPath)) {
    prototypesContent = fs.readFileSync(prototypesMdPath, "utf8");
  } else {
    prototypesContent = "## Prototypes Overview\n\n";
  }

  // Add entry if not already present (by year)
  const entry = `- [${sanitizedName.replace(
    /-/g,
    " "
  )}](./${year}/${sanitizedName}/)\n`;
  if (!prototypesContent.includes(`./${year}/${sanitizedName}/`)) {
    const yearHeader = `### ${year}\n`;
    if (prototypesContent.includes(yearHeader)) {
      const yearIndex =
        prototypesContent.indexOf(yearHeader) + yearHeader.length;
      prototypesContent =
        prototypesContent.slice(0, yearIndex) +
        entry +
        prototypesContent.slice(yearIndex);
    } else {
      prototypesContent += "\n" + yearHeader + entry;
    }

    fs.writeFileSync(prototypesMdPath, prototypesContent);
    console.log("✓ Updated prototypes.md");
  } else {
    console.log("⚠ Entry already exists in prototypes.md");
  }

  console.log(
    `\n✓ Prototype "${sanitizedName}" created successfully in ${year}/`
  );
  console.log(`\nNext steps:`);
  console.log(`  cd use/${year}/${sanitizedName}`);
  console.log(`  # Initialize your project (npm init, etc.)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
