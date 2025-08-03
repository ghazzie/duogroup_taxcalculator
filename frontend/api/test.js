// Test endpoint to verify API is working

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  res.status(200).json({ 
    message: 'API is working!',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
};