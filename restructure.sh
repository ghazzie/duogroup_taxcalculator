#!/bin/bash

# Restructure script for Vercel deployment
# This script moves all frontend files to root level

echo "Starting restructure for Vercel deployment..."

# Create backup
echo "Creating backup..."
cp -r . ../duotax-calculator-backup-$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Move frontend source files to root
echo "Moving frontend files to root..."
if [ -d "frontend/src" ]; then
  mv frontend/src ./src
fi

if [ -d "frontend/public" ]; then
  mv frontend/public ./public  
fi

if [ -f "frontend/index.html" ]; then
  mv frontend/index.html ./index.html
fi

if [ -f "frontend/vite.config.js" ]; then
  mv frontend/vite.config.js ./vite.config.js
fi

if [ -f "frontend/eslint.config.js" ]; then
  mv frontend/eslint.config.js ./eslint.config.js
fi

if [ -f "frontend/.env.production" ]; then
  mv frontend/.env.production ./.env.production
fi

if [ -f "frontend/.env.example" ]; then
  mv frontend/.env.example ./.env.example
fi

# Move API files if they exist in frontend
if [ -d "frontend/api" ]; then
  echo "Found API files in frontend, removing duplicates..."
  rm -rf frontend/api
fi

# Use the new package.json
if [ -f "package.json.new" ]; then
  mv package.json.new package.json
fi

# Use the new vercel.json
if [ -f "vercel.json.new" ]; then
  mv vercel.json.new vercel.json
fi

# Remove old directories
echo "Cleaning up old directories..."
rm -rf frontend
rm -rf backend

# Create a simple .gitignore if needed
if [ ! -f ".gitignore" ]; then
  cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Local files
*.local
README.local.md
DEPLOYMENT_FIX.md

# Temporary files
*.tmp
*.temp
restructure.sh
EOF
fi

echo "Restructure complete!"
echo ""
echo "Next steps:"
echo "1. Review the changes with: git status"
echo "2. Test locally with: npm install && npm run dev"
echo "3. If everything works, commit and push to the branch"
echo ""
echo "The project structure is now:"
echo "/"
echo "├── src/          (React source files)"
echo "├── public/       (Static assets)"
echo "├── api/          (Vercel serverless functions)"
echo "├── index.html    (Entry point)"
echo "├── package.json  (Dependencies)"
echo "├── vite.config.js (Vite configuration)"
echo "└── vercel.json   (Vercel configuration)"