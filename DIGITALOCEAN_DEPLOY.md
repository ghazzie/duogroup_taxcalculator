# Digital Ocean App Platform Deployment Guide

This guide walks you through deploying the DuoGroup Tax Depreciation Calculator to Digital Ocean App Platform.

## Prerequisites

1. A Digital Ocean account (sign up at https://www.digitalocean.com)
2. A GitHub account with access to the repository
3. About $5/month for the basic app tier

## Deployment Steps

### 1. Create a New App

1. Log in to your Digital Ocean account
2. Navigate to "Apps" in the left sidebar
3. Click "Create App"
4. Choose "GitHub" as your source

### 2. Connect Your Repository

1. Authorize Digital Ocean to access your GitHub account
2. Select the repository: `ghazzie/duogroup_taxcalculator`
3. Choose the branch: `digitalocean-deploy`
4. Enable "Autodeploy" for automatic deployments on push

### 3. Configure Resources

Digital Ocean should automatically detect the app.yaml file and configure:
- **Backend Service** (api) - Node.js web service
- **Frontend Static Site** (frontend) - React/Vite static site

If not automatically detected:

#### Backend Service Configuration:
- **Type**: Web Service
- **Source Directory**: `/backend`
- **Build Command**: `npm install`
- **Run Command**: `npm start`
- **HTTP Port**: 5001
- **HTTP Route**: `/api`

#### Frontend Static Site Configuration:
- **Type**: Static Site
- **Source Directory**: `/frontend`
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`
- **Routes**: `/`

### 4. Environment Variables

The app.yaml file includes these environment variables, but verify they're set:

#### Backend:
- `NODE_ENV`: production
- `PORT`: 5001

#### Frontend:
- `VITE_API_URL`: ${APP_URL}/api (this will be auto-populated with your app's URL)

### 5. Review and Launch

1. Review the app configuration
2. Choose your app's region (NYC is recommended)
3. Select the pricing plan (Basic at $5/month should be sufficient)
4. Click "Create Resources"

### 6. Wait for Deployment

The initial deployment will take 5-10 minutes. You can monitor progress in the deployment logs.

### 7. Access Your App

Once deployed, you'll receive a URL like:
`https://duotax-calculator-xxxxx.ondigitalocean.app`

## Testing the Deployment

1. Visit your app URL
2. Test the calculator with sample values:
   - Asset Cost: 100000
   - Salvage Value: 10000
   - Useful Life: 5
   - Method: Straight Line

3. Verify the API is working by visiting:
   `https://your-app-url.ondigitalocean.app/api/health`

## Troubleshooting

### API Not Working
- Check the backend logs in the Digital Ocean dashboard
- Verify environment variables are set correctly
- Ensure the backend service is running on port 5001

### Frontend Not Loading
- Check the build logs for any errors
- Verify the output directory is set to `dist`
- Check browser console for any JavaScript errors

### CORS Issues
- The backend is configured to allow all origins
- If issues persist, check the backend CORS configuration

## Updating the App

1. Make changes to your code
2. Push to the `digitalocean-deploy` branch
3. Digital Ocean will automatically redeploy

## Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Update your domain's DNS records as instructed
4. Digital Ocean provides free SSL certificates

## Monitoring

Digital Ocean provides:
- Real-time logs
- Resource usage metrics
- Alerts for downtime
- Deployment history

## Cost Optimization

- The Basic tier ($5/month) includes:
  - 1 vCPU
  - 512 MB RAM
  - 10 GB bandwidth
- This should be sufficient for moderate traffic
- You can scale up anytime if needed

## Support

For issues specific to:
- **Digital Ocean**: https://www.digitalocean.com/support
- **Application bugs**: Create an issue on GitHub
- **Deployment help**: Check Digital Ocean's extensive documentation

---

## Alternative: Using Digital Ocean CLI

If you prefer command-line deployment:

```bash
# Install doctl
brew install doctl  # macOS
# or
snap install doctl  # Linux

# Authenticate
doctl auth init

# Create app from app.yaml
doctl apps create --spec app.yaml

# List your apps
doctl apps list

# Get deployment logs
doctl apps logs <app-id>
```

Happy deploying! 🚀