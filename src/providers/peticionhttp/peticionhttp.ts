import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Url } from '../../models/Url'

@Injectable()
export class PeticionhttpProvider {
  urlBase: Url = new Url();
  url = this.urlBase.baseMovil;

  constructor(public http: HttpClient) {
    //console.log('Hello PeticionhttpProvider Provider');
  }

  obtenerDatos(cedula: any){
    return this.http.get(this.url+'/get-data/'+cedula);
  }

  updateTokenFCM(data: any[]){
    console.log(data);
    let headers = new HttpHeaders({
      "Accept": 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(this.url+'/update-token', data, {headers: headers});
  }

}
