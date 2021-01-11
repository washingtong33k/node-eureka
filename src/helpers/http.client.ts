import axios from "axios";

export class HttpClient {
  private axiosInstance = axios.create();

  public doGetRequest(url: string, headers: any = {}) {
    return this.axiosInstance.get(url,
      {
        headers
      });
  }

  public doPostRequest(url: string, data: any, headers: any = {}) {
    return this.axiosInstance.post(url, data,
      {
        headers
      });
  }

  public doPutRequest(url: string, data: any, headers: any = {}) {
    return this.axiosInstance.put(url, data,
      {
        headers
      });
  }

  public doDeleteRequest(url: string, headers: any = {}) {
    return this.axiosInstance.delete(url,
      {
        headers
      });
  }
}
