exports.healthCheck = (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(), // in seconds
    timestamp: new Date().toISOString(),
    message: 'API is healthy and running',
  });
};

