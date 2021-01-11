import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import config from './config';
import {IndexController} from "./controller/index.controller";
import {ServicesController} from "./controller/services.controller";
const stage = config.appSettings.app.stage;

console.log('Starting server using stage ' + stage);

const app = express();
const port = config.appSettings.app.port || 3000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use((req, res, next) => {
  if (stage === 'production' && !req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
  } else {
    return next();
  }
});

new IndexController(app);
new ServicesController(app);

const httpServer = http.createServer(app);

httpServer.listen(port, (err?: any) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});

if (stage === 'production') {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/loterando.com.br/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/loterando.com.br/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/loterando.com.br/chain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
}

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
