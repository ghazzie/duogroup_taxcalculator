// Default API endpoint

module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'DuoGroup Tax Calculator API',
    endpoints: [
      '/api/health',
      '/api/test', 
      '/api/calculate-depreciation'
    ]
  });
};