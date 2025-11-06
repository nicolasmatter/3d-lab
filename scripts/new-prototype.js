#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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

// Ask for project type
async function askProjectType() {
  const answer = await askQuestion("Project type? (empty/astro) [empty]: ");
  const type = (answer || "empty").trim().toLowerCase();
  if (type === "astro" || type === "a") {
    return "astro";
  }
  return "empty";
}

// Sanitize prototype name (kebab-case)
function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function main() {
  const originalCwd = process.cwd();

  await resolveName();
  const projectType = await askProjectType();
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

  // Check if prototype directory already exists
  if (fs.existsSync(prototypeDir)) {
    console.error(
      `Error: Prototype "${sanitizedName}" already exists in ${year}/`
    );
    process.exit(1);
  }

  if (projectType === "astro") {
    // For Astro, we'll let npm create astro create the directory
    console.log(`\n🚀 Setting up Astro project...`);
    try {
      // Change to year directory and run Astro CLI
      process.chdir(yearDir);
      execSync(
        `npm create astro@latest ${sanitizedName} -- --template minimal --yes --no-install --no-git`,
        { stdio: "inherit" }
      );
      console.log(`✓ Astro project created`);
      // Restore original working directory
      process.chdir(originalCwd);
    } catch (error) {
      process.chdir(originalCwd);
      console.error("Error creating Astro project:", error.message);
      process.exit(1);
    }
  } else {
    // Create empty prototype directory
    fs.mkdirSync(prototypeDir, { recursive: true });
    console.log(`✓ Created prototype directory: ${year}/${sanitizedName}/`);
  }

  // Only create .gitignore and README for empty projects
  // Astro projects already have their own setup
  if (projectType === "empty") {
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
  } else {
    // For Astro, update the README that was created
    const astroReadmePath = path.join(prototypeDir, "README.md");
    if (fs.existsSync(astroReadmePath)) {
      const existingReadme = fs.readFileSync(astroReadmePath, "utf8");
      const updatedReadme = `${existingReadme}

## Year
${year}

## Key Learnings
- Learning point 1
- Learning point 2

## Resources
- Link to relevant resources
`;
      fs.writeFileSync(astroReadmePath, updatedReadme);
      console.log("✓ Updated README.md");
    }
  }

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
  if (projectType === "astro") {
    console.log(`  npm install`);
    console.log(`  npm run dev`);
  } else {
    console.log(`  # Initialize your project (npm init, etc.)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
