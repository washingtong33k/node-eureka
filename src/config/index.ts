import AppSettingsLocal from './appsettings-local.json'
import AppSettingsProduction from './appsettings-production.json';

export default class Config {
  private static instance: any;
  static appSettings: any = Config.getInstance();

  private static getInstance() {
    if (!Config.instance) {
      Config.instance = Config.getAppSettings();
    }
    return Config.instance;
  }

  private static getAppSettings() {
    if (process.env.STAGE === 'production') {
      return AppSettingsProduction;
    }
    return AppSettingsLocal;
  }
}
