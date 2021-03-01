import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import {IndexController} from "./controller/index.controller";
import {ServicesController} from "./controller/services.controller";
import {HttpClient} from "./helpers/http.client";
import {ServicesHelper} from "./helpers/services.helper";
import fileUpload from 'express-fileupload';
import FormData from 'form-data';
import {v4 as uuidv4} from "uuid";
const stage = config.appSettings.app.stage;

console.log('Starting server using stage ' + stage);

const app = express();
const port = config.appSettings.app.port || 3000;
const httpClient: HttpClient = new HttpClient();
const enableCors = process.env.CORS && process.env.CORS === '1' || false;

if (enableCors) {
  console.info('CORS enabled');
  app.use(cors());
}

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use((req, res, next) => {
  if (stage === 'production' && !req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
  } else {
    return next();
  }
});

const handleRequest = async (req: any, res: any) => {
  const service = ServicesHelper.getService(req.params.service);

  if (service) {
    let url = `${service.baseUrl}`;

    if (req.params['0']) {
      url += `/${req.params['0']}`;
    }

    console.log(`Handling [${service.name}][${req.method}] ${url}`);

    let headers = ServicesHelper.parseHeaders(req.headers, service);
    let bodyParams = req.body;

    if (req.files && Object.keys(req.files).length > 0) {
      const formData = new FormData();

      for (const index in req.files) {
        if (req.files[index]) {
          const file = fs.readFileSync(req.files[index].tempFilePath);

          if (req.files[index]) {
            formData.append(index, file, req.files[index].name);
          }

          fs.unlinkSync(req.files[index].tempFilePath);
        }
      }

      for (const index in req.body) {
        if (req.body[index]) {
          formData.append(index, req.body[index]);
        }
      }

      bodyParams = formData.getBuffer();

      headers = {
        ...headers,
        ...formData.getHeaders()
      };
    }

    httpClient.doRequest(url, bodyParams, req.method, headers)
      .then(response => {
        return res.status(200).send(response.data);
      })
      .catch(err => {
        return res.status(err.response.status).send(err.response.data);
      });
  } else {
    return res.status(404).send({status: 'NOT_FOUND'});
  }
};

app.options('/api/:service/*', handleRequest);
app.get('/api/:service/*', handleRequest);
app.post('/api/:service/*', handleRequest);
app.put('/api/:service/*', handleRequest);
app.delete('/api/:service/*', handleRequest);

const instanceId = uuidv4();

console.log(`Instance Id: ${instanceId}`);

new IndexController(app, instanceId);
new ServicesController(app, instanceId);

const httpServer = http.createServer(app);

httpServer.listen(port, (err?: any) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Server is listening on ${port}`);
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
