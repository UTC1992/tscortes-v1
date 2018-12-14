import { Component } from '@angular/core';
import {  IonicPage, ToastController, LoadingController,
          NavController, NavParams, AlertController,
        } from 'ionic-angular';

import { TareasProvider } from '../../providers/tareas/tareas';
import { UserProvider } from '../../providers/user/user';
import { RecmanualProvider } from '../../providers/recmanual/recmanual';

@IonicPage()
@Component({
  selector: 'page-borrardatos',
  templateUrl: 'borrardatos.html',
})
export class BorrardatosPage {

  notTotal;
  corTotal;
  recTotal;
  recmaTotal;
  retiroTotal;

  constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public tareaDB: TareasProvider,
                public userDB: UserProvider,
                public recmanualDB: RecmanualProvider,
                public alertCtrl: AlertController
              ) {

    this.consultarTotales();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad BorrardatosPage');
  }

  limpiarNot(){
    let codigoAct = '010';
    this.tareaDB.clearTables(codigoAct).then(res => {
      //console.log(res);
      if(res){
        this.userDB.getUsers().then((res) => {
          this.userDB.updateEstado('Inactivo', res[0]['id_user']).then(resAux =>{
            this.consultarTotales();
            this.showToast('Datos eliminados correctamente');
          }).catch(e => {
            this.showToast('Error => '+ e);
          });
        });
      } else {
        this.showToast('No se pudo eliminar los datos');
      }
    });
  }

  limpiarCor(){
    let codigoAct = '030';
    this.tareaDB.clearTables(codigoAct).then(res => {
      if(res){
        this.userDB.getUsers().then((res) => {
          this.userDB.updateEstado('Inactivo', res[0]['id_user']).then(resAux =>{
            this.consultarTotales();
            this.showToast('Datos eliminados correctamente');
          }).catch(e => {
            this.showToast('Error => '+ e);
          });
        });
      } else {
        this.showToast('No se pudo eliminar los datos');
      }
    });
  }

  limpiarRec(){
    let codigoAct = '040';
    this.tareaDB.clearTables(codigoAct).then(res => {
      if(res){
        this.userDB.getUsers().then((res) => {
          this.userDB.updateEstado('Inactivo', res[0]['id_user']).then(resAux =>{
            this.consultarTotales();
            this.showToast('Datos eliminados correctamente');
          }).catch(e => {
            this.showToast('Error => '+ e);
          });
        });
      } else {
        this.showToast('No se pudo eliminar los datos');
      }
    });
  }

  limpiarRecManual(){
    this.recmanualDB.clearTables().then(res => {
      if(res){
        this.userDB.getUsers().then((res) => {
          this.userDB.updateEstado('Inactivo', res[0]['id_user']).then(resAux =>{
            this.consultarTotales();
            this.showToast('Datos eliminados correctamente');
          }).catch(e => {
            this.showToast('Error => '+ e);
          });
        });
      } else {
        this.showToast('No se pudo eliminar los datos');
      }
    });
  }
  
  eliminarRetiroMed(){
    let codigoAct = '050';
    this.tareaDB.clearTables(codigoAct).then(res => {
      if(res){
        this.userDB.getUsers().then((res) => {
          this.userDB.updateEstado('Inactivo', res[0]['id_user']).then(resAux =>{
            this.consultarTotales();
            this.showToast('Datos eliminados correctamente');
          }).catch(e => {
            this.showToast('Error => '+ e);
          });
        });
      } else {
        this.showToast('No se pudo eliminar los datos');
      }
    });
  }
  
  consultarTotales(){
    this.tareaDB.getListaTareasParaEnviar('10', '010').then(data1 =>{
      this.notTotal = data1.length;
    });

    this.tareaDB.getListaTareasParaEnviar('30', '030').then(data1 =>{
      this.corTotal = data1.length;
    });

    this.tareaDB.getListaTareasParaEnviar('40', '040').then(data1 =>{
      this.recTotal = data1.length;
    });

    this.tareaDB.getListaTareasParaEnviar('50', '050').then(data1 =>{
      this.retiroTotal = data1.length;
    });

    this.recmanualDB.contarRecManual().then(data1 =>{
      this.recmaTotal = data1;
    });

  }

  showToast(mensaje: any) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 5000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
  }

  eliminarNot(){
    let confirm = this.alertCtrl.create({
      title: 'Desea eliminar la Notificaciones?',
      message: 'Al oprimir "Aceptar" se eliminaran todas las Notificaciones permanentemente, desea hacerlo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            //console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            //console.log('Eliminar');
            this.limpiarNot();
          }
        }
      ]
    });
    confirm.present();

  }

  eliminarCor(item: any){
    let confirm = this.alertCtrl.create({
      title: 'Desea eliminar los Cortes?',
      message: 'Al oprimir "Aceptar" se eliminaran todos los Cortes permanentemente, desea hacerlo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            //console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            //console.log('Eliminar');
            this.limpiarCor();
          }
        }
      ]
    });
    confirm.present();

  }

  eliminarRec(item: any){
    let confirm = this.alertCtrl.create({
      title: 'Desea eliminar las Reconecciones?',
      message: 'Al oprimir "Aceptar" se eliminaran todas las Reconecciones permanentemente, desea hacerlo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            //console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            //console.log('Eliminar');
            this.limpiarRec();
          }
        }
      ]
    });
    confirm.present();

  }

  eliminarRecManual(item: any){
    let confirm = this.alertCtrl.create({
      title: 'Desea eliminar las Reconecciones Manuales?',
      message: 'Al oprimir "Aceptar" se eliminaran Las Reconecciones Manuales permanentemente, desea hacerlo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            //console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            //console.log('Eliminar');
            this.limpiarRecManual();
          }
        }
      ]
    });
    confirm.present();

  }

  eliminarRetiroMedidor(item: any){
    let confirm = this.alertCtrl.create({
      title: 'Desea eliminar los retiros de medidores?',
      message: 'Al oprimir "Aceptar" se eliminaran todos los retiros permanentemente, desea hacerlo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            //console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            //console.log('Eliminar');
            this.eliminarRetiroMed();
          }
        }
      ]
    });
    confirm.present();

  }

}
