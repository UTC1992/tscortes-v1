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

import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usuarios;
  user:any[] = [];

  myphoto: string = null;

  constructor(
    public navCtrl: NavController,
    private sqlite: SQLite,
    private toast: Toast,
    public http: Http,
    private alertCtrl: AlertController,
    public userDB: UserProvider,
    public toastCtrl: ToastController,
    public tareas: TareasProvider,
    private camera: Camera,
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
        this.user = res[0];
        this.myphoto = this.user['foto'];
        console.log(this.user);
      }
    });
  }

  mostrarPerfil(){
    this.navCtrl.push('PerfilPage');
  }

  takePhoto(){
    //console.log("foto perfil");
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.myphoto = 'data:image/jpeg;base64,' + imageData;
     //console.log('data:image/jpeg;base64,' + imageData);
      this.userDB.updateFoto(this.myphoto, this.user['id_user']).then(res => {
        if(res){
          this.showMensaje('Éxito !', 'Tu foto de perfil fue actualizada.');
          this.mostrarDatosPersonales();
        } else {
          this.showMensaje('Alerta!', 'Tu foto de perfil no se actualizó.');
        }
      });
     //this.crearCarpeta();
    }, (err) => {
     // Handle error
    });
  }

  showMensaje(titulo, mensaje){
      const alert = this.alertCtrl.create({
        title: titulo,
        subTitle: mensaje,
        buttons: ['OK']
      });
      alert.present();
  }

}
