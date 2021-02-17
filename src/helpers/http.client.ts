import axios from "axios";

export class HttpClient {
  private axiosInstance = axios.create();

  public doRequest(url: string, data: any, method: 'GET'|'POST'|'PUT'|'DELETE' = 'GET', headers: any = {}) {
    switch (method) {
      case 'GET':
        return this.doGetRequest(url, headers);
      case 'POST':
        return this.doPostRequest(url, data, headers);
      case 'PUT':
        return this.doPostRequest(url, data, headers);
      case 'DELETE':
        return this.doPostRequest(url, headers);
    }
  }

  public doGetRequest(url: string, headers: any = {}) {
    return this.axiosInstance.get(url, {headers});
  }

  public doPostRequest(url: string, data: any, headers: any = {}) {
    return this.axiosInstance.post(url, data, {headers});
  }

  public doPutRequest(url: string, data: any, headers: any = {}) {
    return this.axiosInstance.put(url, data, {headers});
  }

  public doDeleteRequest(url: string, headers: any = {}) {
    return this.axiosInstance.delete(url, {headers});
  }
}
