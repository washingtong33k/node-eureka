import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import config from './config';
import {IndexController} from "./controller/index.controller";
import {ServicesController} from "./controller/services.controller";
import {HttpClient} from "./helpers/http.client";
import {ServicesHelper} from "./helpers/services.helper";
const stage = config.appSettings.app.stage;

console.log('Starting server using stage ' + stage);

const app = express();
const port = config.appSettings.app.port || 3000;
const httpClient: HttpClient = new HttpClient();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use((req, res, next) => {
  if (stage === 'production' && !req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
  } else {
    return next();
  }
});

app.get('/api/:service/*', async (req: any, res: any) => {
  const service = ServicesHelper.getService(req.params.service);

  if (service) {
    let url = `${service.baseUrl}`;

    if (req.params['0']) {
      url += `/${req.params['0']}`;
    }

    const headers = ServicesHelper.parseHeaders(req.headers, service);

    httpClient.doGetRequest(url, headers)
      .then(response => {
        res.status(200).send(response.data);
      })
      .catch(err => {
        res.status(500).send({
          status: 'ERROR',
          err
        });
      });
  } else {
    res.status(404).send({status: 'NOT_FOUND'});
  }
});

app.post('/api/:service/*', async (req: any, res: any) => {
  const service = ServicesHelper.getService(req.params.service);

  if (service) {
    let url = `${service.baseUrl}`;

    if (req.params['0']) {
      url += `/${req.params['0']}`;
    }

    const headers = ServicesHelper.parseHeaders(req.headers, service);

    httpClient.doPostRequest(url, req.body, headers)
      .then(response => {
        res.status(200).send(response.data);
      })
      .catch(err => {
        res.status(500).send({
          status: 'ERROR',
          err
        });
      });
  } else {
    res.status(404).send({status: 'NOT_FOUND'});
  }
});

app.put('/api/:service/*', async (req: any, res: any) => {
  const service = ServicesHelper.getService(req.params.service);

  if (service) {
    let url = `${service.baseUrl}`;

    if (req.params['0']) {
      url += `/${req.params['0']}`;
    }

    const headers = ServicesHelper.parseHeaders(req.headers, service);

    httpClient.doPutRequest(url, req.body, headers)
      .then(response => {
        res.status(200).send(response.data);
      })
      .catch(err => {
        res.status(500).send({
          status: 'ERROR',
          err
        });
      });
  } else {
    res.status(404).send({status: 'NOT_FOUND'});
  }
});

app.delete('/api/:service/*', async (req: any, res: any) => {
  const service = ServicesHelper.getService(req.params.service);

  if (service) {
    let url = `${service.baseUrl}`;

    if (req.params['0']) {
      url += `/${req.params['0']}`;
    }

    const headers = ServicesHelper.parseHeaders(req.headers, service);

    httpClient.doDeleteRequest(url, headers)
      .then(response => {
        res.status(200).send(response.data);
      })
      .catch(err => {
        res.status(500).send({
          status: 'ERROR',
          err
        });
      });
  } else {
    res.status(404).send({status: 'NOT_FOUND'});
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
