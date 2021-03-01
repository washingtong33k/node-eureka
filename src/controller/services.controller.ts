import {ControllerBase} from "./controller.base";
import {Express} from "express";
import {ControllerInterface} from "./controller.interface";
import {Service} from "../model/service";
import {ServicesHelper} from "../helpers/services.helper";

export class ServicesController extends ControllerBase implements ControllerInterface{
  private app: any | Express = null;
  private instanceId = '';

  constructor(app: Express, instanceId: string) {
    super();
    this.app = app;
    this.baseUri = '/services';
    this.instanceId = instanceId;

    this.initController();
  }

  initController() {
    this.app.post(`${this.baseUri}/register`, async (req: any, res: any) => {
      const registered = this.handleRegistration(req);

      if (registered) {
        res.status(200).send({status: 'SUCCESS', instance: this.instanceId});
      } else {
        res.status(500).send({status: 'ERROR'});
      }
    });
  }

  private handleRegistration(request: any) {
    const service = Object.assign(new Service(), request.body);
    const registered = ServicesHelper.registerService(service);

    if (registered) {
      for (const route of service.routes) {
        const baseUrl = `/api/${service.name}${route.uri}`;
        console.info(`[${service.name}] ${route.method}: ${baseUrl}`);
      }

      return true;
    }

    return false;
  }
}
