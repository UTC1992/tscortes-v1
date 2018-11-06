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
    public toastCtrl: ToastController
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
      console.log("Respuesta de promise "+res);
      if(res == false){
        this.navCtrl.push('RegistroPage');
      }else{
        console.log(res);
        this.user = res[0];
      }
    });
  }

  mostrarDatosPersonales(){
    this.userDB.getUsers().then((res) => {
      if(res == false){
        this.user = [];
      }else{
        console.log(res[0]);
        this.user = res[0];
      }
    });
  }

  mostrarPerfil(){
    this.navCtrl.push('PerfilPage');
  }

/*
  editarUsuario(todo){
    console.log(this.user['cedula']);
    let prompt = this.alert.create({
      title: 'Editar',
      subTitle:'Modificar datos personales:',
      message: '',
      inputs:[
        {
          name: 'cedula',
          value: this.user['cedula'],
          type: 'number'
        },
        {
          name: 'nombres',
          value: this.user['nombres']
        },
        {
          name: 'apellidos',
          value: this.user['apellidos']
        },

      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Actualizar',
          handler: (data) => {

            if(data.cedula != "" && data.nombres != "" && data.apellidos != ""){
              this.validacionAlerEdicion(data);
              this.userDB.actualizar(data, this.user['id_user'])
                .then( response =>{
                  if(response){
                    this.mostrarDatosPersonales();
                  }
                  else{
                    console.log('Error al actualizar revisar codigo por favor');
                  }
                });
            } else {
              //this.presentToast("Todos los campos son requeridos. Por favor ingrese la información.");
              prompt.setMessage('Todos los campos son requeridos.');
              return false;
            }
          }
        }
      ],
      enableBackdropDismiss: false

    });

    prompt.present();

  }

  validacionAlerEdicion(data: any){
    if(data.cedula == ""){

    }
  }




  presentToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      position: 'top',
      showCloseButton: true
    });

    toast.dismiss();

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }



  ionViewWillEnter() {
    this.getDatosPersonales();
  }


  createDatabase() {
    this.sqlite.create({
      name: 'empresacortes.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

   db.executeSql("CREATE TABLE IF NOT EXISTS users("
                +" id_user INTEGER PRIMARY KEY AUTOINCREMENT,"
                +" cedula TEXT,"
                +" nombres TEXT,"
                +" apellidos TEXT"
                + ")",[])
        .then(res => console.log('Executed SQL'))
        .catch(e => {
          console.log(e);
          this.toast.show("Create:" + e.message, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });

        db.executeSql("CREATE TABLE IF NOT EXISTS ejemplo("
                +" id INTEGER PRIMARY KEY AUTOINCREMENT,"
                +" name TEXT,"
                +" username TEXT,"
                +" email TEXT"
                + ")",[])
        .then(res => console.log('Executed SQL'))
        .catch(e => {
          console.log(e);
          this.toast.show("Create:" + e.message, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });

        db.executeSql("CREATE TABLE IF NOT EXISTS actividades("
                +" id_acti INTEGER PRIMARY KEY AUTOINCREMENT,"
                +" id_user INTEGER,"
                +" n9cono TEXT,"
                +" n9cocu TEXT,"
                +" n9cose TEXT,"
                +" n9coru TEXT,"
                +" n9plve TEXT,"
                +" n9vaca TEXT,"
                +" n9meco TEXT,"
                +" n9leco TEXT,"
                +" n9nomb TEXT,"
                +" n9refe TEXT,"
                +" n9cobs TEXT,"
                +" observacion TEXT"
                + ")",[])
        .then(res => console.log('Executed SQL'))
        .catch(e => {
          console.log(e);
          this.toast.show("Create:" + e.message, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
        db.executeSql("CREATE TABLE IF NOT EXISTS recmanuales("
                +" id_rema INTEGER PRIMARY KEY AUTOINCREMENT,"
                +" id_user INTEGER,"
                +" medidor TEXT,"
                +" lectura TEXT,"
                +" observacion TEXT"
                + ")",[])
        .then(res => console.log('Executed SQL'))
        .catch(e => {
          console.log(e);
          this.toast.show("Create:" + e.message, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
      db.executeSql('SELECT * FROM users ORDER BY id_user DESC', [])
        .then(res => {
          this.usuarios = [];
          for (var i = 0; i < res.rows.length; i++) {
            this.usuarios.push({
                                id_user: res.rows.item(i).id_user,
                                cedula: res.rows.item(i).cedula,
                                nombres: res.rows.item(i).nombres,
                                apellidos: res.rows.item(i).apellidos
                              })
          }
          //compronar si existen usuarios
          if(this.usuarios.length == 0){
            this.navCtrl.push(RegistroPage);
          }
          //compronar si existen usuarios
        });
    });
  }



  */

}
