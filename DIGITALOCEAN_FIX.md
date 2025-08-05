# Digital Ocean Deployment Configuration Fix

Based on the screenshots, your Digital Ocean deployment needs the following fixes:

## Issue 1: Missing Build Command
The backend service shows "No build command defined". You need to add:
- **Build Command**: `npm install`

## Issue 2: Wrong Port Configuration
The service is configured for port 8080, but should be 5001:
- **HTTP Port**: Change from `8080` to `5001`

## Issue 3: Missing Frontend Static Site
You only have the backend configured. You need to add the frontend static site.

## Quick Fix Steps:

### 1. Fix Backend Service:
Click "Edit" on the deployment settings and update:
- **Build Command**: `npm install`
- **Run Command**: `node index.js` → Change to `npm start`
- **HTTP Port**: `8080` → Change to `5001`
- **HTTP Route**: Keep as `/api`

### 2. Add Environment Variables:
Click "Edit" on Environment variables and add:
- `NODE_ENV` = `production`
- `PORT` = `5001`

### 3. Add Frontend Static Site:
Click "Add Resource" → "Static Site" and configure:
- **Resource Name**: `frontend`
- **Source Directory**: `/frontend`
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`
- **Routes**: `/`

### 4. Add Frontend Environment Variable:
For the frontend static site, add:
- `VITE_API_URL` = `${APP_URL}/api`

## Alternative: Use app.yaml File

Instead of manual configuration, you can:

1. Cancel the current setup
2. When creating the app, ensure Digital Ocean detects the `app.yaml` file
3. The app.yaml file in the `digitalocean-deploy` branch has all correct settings

## After Deployment:

Test the deployment:
1. Visit your app URL
2. Check API health: `https://your-app.ondigitalocean.app/api/health`
3. Test the calculator functionality

## Important Notes:

- The backend server.js has been updated to default to port 5001
- Make sure to push the latest changes to the `digitalocean-deploy` branch
- The total cost should be around $5-10/month for basic tier