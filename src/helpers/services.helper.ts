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
        return false;
      }
    } else {
      console.error(`Please provide a name for the service`);
      return false;
    }
  }

  public static hasService(serviceName: string) {
    return ServicesHelper.registeredServices.filter(obj => obj.name == serviceName).length > 0;
  }
}
