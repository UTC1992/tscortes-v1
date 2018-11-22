import { Component } from '@angular/core';
import {  NavController,
          AlertController,
          ToastController,
        IonicPage } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Toast } from '@ionic-native/toast';
import 'rxjs/add/operator/toPromise';

import { UserProvider } from '../../providers/user/user';
import { TareasProvider } from '../../providers/tareas/tareas';

@IonicPage()

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usuarios;
  user:any[] = [];

  constructor(
    public navCtrl: NavController,
    private sqlite: SQLite,
    private toast: Toast,
    public http: Http,
    private alert: AlertController,
    public userDB: UserProvider,
    public toastCtrl: ToastController,
    public tareas: TareasProvider
  ) {

  }

  ionViewDidLoad() {
    this.getContarUsers();
  }

  ionViewWillEnter(){
    this.mostrarDatosPersonales();
  }

  getContarUsers(){
    this.userDB.getUsers().then((res) => {
      //console.log("Respuesta de promise "+res);
      if(res == false){
        this.navCtrl.push('RegistroPage');
      }else{
        //console.log(res);
        this.user = res[0];
      }
    });
  }

  mostrarDatosPersonales(){
    this.userDB.getUsers().then((res) => {
      if(res == false){
        this.user = [];
      }else{
        //console.log(res[0]);
        this.user = res[0];
      }
    });
  }

  mostrarPerfil(){
    this.navCtrl.push('PerfilPage');
  }

}
