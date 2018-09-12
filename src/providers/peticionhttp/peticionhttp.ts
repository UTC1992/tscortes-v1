import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
export class PeticionhttpProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PeticionhttpProvider Provider');
  }

  obtenerDatos(){
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }

}
