import axios from "axios";

export class HttpClient {
  private axiosInstance = axios.create();

  public doGetRequest(url: string) {
    return this.axiosInstance.get(url);
  }
}
