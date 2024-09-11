const http = require('node:http');
const https = require('node:https');
const URL = require('node:url');
const cookie = require('cookie'); // Import the cookie module

const pumpfunHost = "frontend-api.pump.fun"
const pumpfunLivekitApi = "/livestreams/livekit/token/host"

const server = http.createServer((req, res) => {
  
  const query = URL.parse(req.url, true).query;

  const {roomId, creator} = query
  const reqHeaders = req.headers;
  const cookies = cookie.parse(reqHeaders.cookie || '');
  const {auth_token} = cookies

  https.get({
    hostname: pumpfunHost,
    path: `${pumpfunLivekitApi}?mint=${roomId}&creator=${creator}`, 

    headers: {
      'cookie': `auth_token=${auth_token}`,
    }
  }, (externalRes) => {
    let data = '';
    externalRes.on('data', (chunk) => {
      data += chunk;
    });

    externalRes.on('end', () => {
      //res.writeHead(200, { 'Content-Type': 'application/json' });
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });

  }).on('error', (err) => {
    console.log(err)
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error: ' + err.message);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});