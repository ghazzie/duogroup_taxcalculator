# Guaranteed Fix for Vercel Deployment

## Option 1: Deploy API Separately (EASIEST)

1. Create a new Vercel project for the API:
   - Go to Vercel Dashboard
   - Import the same GitHub repo
   - Set Root Directory: leave empty
   - Set Framework Preset: Other
   - Deploy

2. Update frontend to use the new API URL:
   - Get your API URL (e.g., https://duotax-api.vercel.app)
   - Update frontend/src/App.jsx to use this URL
   - Redeploy frontend

## Option 2: Use Vercel's Edge Functions (RECOMMENDED)

Create these files in the root:

### /api/calculate.js
```javascript
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const body = await request.json();
  // Add calculation logic here
  
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
```

## Option 3: Restructure Project (MOST RELIABLE)

Move everything to root:
```bash
# Move frontend files to root
mv frontend/src ./src
mv frontend/public ./public
mv frontend/package.json ./package.json
mv frontend/vite.config.js ./vite.config.js
# ... etc

# Remove frontend directory
rm -rf frontend

# Update vercel.json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Quick Test

After deployment, test these URLs:
1. https://your-app.vercel.app/api/health
2. https://your-app.vercel.app/api/test

If they return JSON, the API is working!