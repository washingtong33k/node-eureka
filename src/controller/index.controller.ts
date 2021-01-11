import {ControllerBase} from "./controller.base";
import {Express} from "express";
import {ControllerInterface} from "./controller.interface";
import {ServicesHelper} from "../helpers/services.helper";

export class IndexController extends ControllerBase implements ControllerInterface{
  private app: any | Express = null;

  constructor(app: Express) {
    super();
    this.app = app;

    this.initController();
  }

  initController() {
    this.app.get('/status', async (req: any, res: any) => {
      res.status(200).send(ServicesHelper.registeredServices);
    });
  }
}
