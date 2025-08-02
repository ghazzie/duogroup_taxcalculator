// Health check endpoint for the API

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  res.status(200).json({ 
    status: 'OK', 
    message: 'Tax Depreciation Calculator API is running on Vercel',
    timestamp: new Date().toISOString()
  });
}