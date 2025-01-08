import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GenericTableService {
  constructor(private http: HttpClient) { }
  async get(requestParam: any) {
    const headers = requestParam.headers ? new HttpHeaders(requestParam.headers) : new HttpHeaders();
    const options = {
      headers: headers
    };
    return this.http.get(requestParam.url, options).toPromise()
      .then((data: any) => {
        let result: any = data;
        console.log(result, "result");
        if (result.responseCode === "OK") {
          return result;
        } else {
          return data;
        }
      });
  }
}
