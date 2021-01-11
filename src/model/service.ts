import {ServiceRoute} from "./service-route";

export class Service {
  public name: string = '';
  public baseUrl: string = '';
  public overwrite: boolean = false;
  public routes: ServiceRoute[] = [];

  public getRoute(uri: string) {

  }
}
