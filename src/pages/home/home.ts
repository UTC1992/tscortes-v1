import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Toast } from '@ionic-native/toast';
import 'rxjs/add/operator/toPromise';

import { RegistroPage } from '../../pages/registro/registro';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usuarios: any[] = [];
  user:any[] = [];

  constructor(
    public navCtrl: NavController,
    private sqlite: SQLite,
    private toast: Toast,
    public http: Http,
    private alert: AlertController
  ) {

  }

  ngOnInit(){
    this.getData();
  }

  ionViewDidLoad() {
    this.getData();
  }

  ionViewWillEnter() {

  }

  getData() {
    this.sqlite.create({
      name: 'empresacortes.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

   db.executeSql("CREATE TABLE IF NOT EXISTS users("
                +" id INTEGER PRIMARY KEY AUTOINCREMENT,"
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
        db.executeSql("CREATE TABLE IF NOT EXISTS actividades("
                +" id INTEGER PRIMARY KEY AUTOINCREMENT,"
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
      db.executeSql('SELECT * FROM users ORDER BY id DESC', [])
        .then(res => {
          this.usuarios = [];
          for (var i = 0; i < res.rows.length; i++) {
            this.usuarios.push({
                                id: res.rows.item(i).id,
                                cedula: res.rows.item(i).cedula,
                                nombres: res.rows.item(i).nombres,
                                apellidos: res.rows.item(i).apellidos
                              })
          }

          //asignar datos de unico usuario

          //compronar si existen usuarios
          if(this.usuarios.length == 0){
            this.navCtrl.push(RegistroPage);
          }else{
            this.user = this.usuarios[0];
            console.log(this.user);
          }
          //compronar si existen usuarios

        })
    })
  }

  mensaje(){
    if(this.usuarios.length != 0){
      var user;
      for (let i = 0; i < this.usuarios.length; i++) {
        user = this.usuarios[i].nombres;
      }
      let alert2 = this.alert.create({
        title: 'Hola '+user,
        buttons: ['En marcha']
      });
      alert2.present();
    }
  }

}
