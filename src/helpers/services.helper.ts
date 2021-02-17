import {Service} from "../model/service";

export class ServicesHelper {
  public static registeredServices: Service[] = [];

  public static registerService(service: Service) {
    if (service.name) {
      if (!ServicesHelper.hasService(service.name)) {
        console.info(`Registering service ${service.name} using URL ${service.baseUrl}`);
        ServicesHelper.registeredServices.push(service);
        return true;
      } else {
        console.error(`There's already a service registered with the name ${service.name}`);
        return true;
      }
    } else {
      console.error(`Please provide a name for the service`);
      return false;
    }
  }

  public static hasService(serviceName: string) {
    return ServicesHelper.registeredServices.filter(obj => obj.name == serviceName).length > 0;
  }

  public static getService(serviceName: string): Service | any {
    const servicesFiltered = ServicesHelper.registeredServices.filter(obj => obj.name == serviceName);

    if (servicesFiltered.length > 0) {
      return servicesFiltered[0];
    }

    return null;
  }

  public static parseHeaders(headers: any, service: Service) {
    headers.host = service.baseUrl;

    return headers;
  }
}
