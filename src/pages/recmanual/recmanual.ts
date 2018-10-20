import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController,
  NavParams, LoadingController, AlertController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { RecmanualProvider } from '../../providers/recmanual/recmanual';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-recmanual',
  templateUrl: 'recmanual.html',
})
export class RecmanualPage {

  //busqueda de medidores
  searchTerm: string = '';
  items: any[] = [];
  searchControl: FormControl;
  searching: any = false;

  constructor(
              public navCtrl: NavController,
              public navParams: NavParams,
              public userDB: UserProvider,
              public recmanualDB: RecmanualProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public toast: Toast,
              public toastCtrl: ToastController
  ) {
    this.searchControl = new FormControl();

  }

  ionViewDidLoad() {
    this.getContarUsers();
    //this.mostrarDatosJSON();
    this.ingresarItemsParaFiltrar();
    this.searchControl.valueChanges.debounceTime(500).subscribe(search  => {
    this.searching = false;//mostrar cargando
    this.ingresarItemsParaFiltrar();
    });
  }

  getContarUsers(){
    this.userDB.getUsers().then((res) => {

      console.log("Respuesta de promise "+res);
      if(res == false){
        this.navCtrl.push('RegistroPage');
        //obtener datos del URL

      }else{
      }
    });
  }

  ingresarItemsParaFiltrar() {
    this.recmanualDB.getListaRecM().then(data =>{
      if(data.length > 0){
        console.log(data);
        this.items = data;

        //filtrara y buscar datos de la lista
        this.items = this.items.filter((item) => {
          return item['medidor'].toLowerCase().indexOf(
            this.searchTerm.toLowerCase()) > -1;

          });
        console.log("DATOS OBTENIDOS DE PROMISE");
        console.log(this.items);
      }
    });

  }

  onSearchInput(){
    this.searching = true;
   }

  nuevaRecManual(){
    this.navCtrl.push('RecnuevaPage');
  }

  mostrarRecManual(item: any){
    //console.log(item);
    let loading = this.loadingCtrl.create({
      content: 'Obtener datos...'
    });
    loading.present();
    loading.dismiss();
    this.navCtrl.push('RecmanualeditPage', {'datosRecManual': item});
  }

  eliminar(item: any){
    let confirm = this.alertCtrl.create({
      title: 'Desea eliminar la reconexión?',
      message: 'Si oprime "Aceptar" la reconexión se borrara permanentemente desea hacerlo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Eliminar');
            this.recmanualDB.delete(item['id_recm']).then(r =>{
              if(r){
                this.showToast('Datos eliminados correctamente');
                this.ingresarItemsParaFiltrar();
              } else {
                this.showToast('Error al eliminar los datos');
              }
            });
          }
        }
      ]
    });
    confirm.present();

  }

  showToast(mensaje: any) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 5000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
