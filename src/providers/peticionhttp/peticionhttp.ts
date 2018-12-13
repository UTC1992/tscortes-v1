import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';

@Injectable()
export class PeticionhttpProvider {

  baseURLApi = 'http://pruebas.tiendanaturalecuador.online/api'

  constructor(public http: HttpClient) {
    //console.log('Hello PeticionhttpProvider Provider');
  }

  obtenerDatos(cedula: any){
    return this.http.get(this.baseURLApi+'/mobile/get-data/'+cedula);
  }

}
