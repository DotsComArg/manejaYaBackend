module.exports = (req, res) => {
  console.log('=== HEALTH ENDPOINT ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request in health');
    res.status(200).end();
    return;
  }

  console.log('Sending health check response');
  res.status(200).json({
    message: 'Backend funcionando correctamente',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoint: '/api/health',
    method: req.method,
    endpoints: {
      health: '/api/health',
      formulario: '/api/formulario/enviar',
      index: '/api/'
    }
  });
};
