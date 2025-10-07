module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    message: 'Backend maneja ya funcionando',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoint: '/',
    method: req.method,
    note: 'Accede a /api para más endpoints'
  });
};
