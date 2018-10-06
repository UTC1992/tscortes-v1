import { Component } from '@angular/core';
import {  IonicPage, NavController,
          NavParams, AlertController,
          LoadingController } from 'ionic-angular';

import { Toast } from '@ionic-native/toast';

import { PeticionhttpProvider } from '../../providers/peticionhttp/peticionhttp';
import { UserProvider } from '../../providers/user/user';
import { TareasProvider } from '../../providers/tareas/tareas';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-notificacion',
  templateUrl: 'notificacion.html',
})
export class NotificacionPage {

  dataJSON;

  searchTerm: string = '';
  items: any[] = [];
  searchControl: FormControl;
  searching: any = false;

  estadoTecnicoGet: boolean;
  estadoTecnicoPost: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public peticion: PeticionhttpProvider,
    private toast: Toast,
    public userDB: UserProvider,
    public tareas: TareasProvider,
    public loadingCtrl: LoadingController
  ) {

    this.searchControl = new FormControl();
    this.estadoTecnicoPost = true;


  }

  presentLoadingDefault() {





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

      //console.log(res[0]['estado']);
      if(res[0]['estado'] == "Pasivo" || res[0]['estado'] == null){
        //console.log('tecnico pasivo o null');
        this.estadoTecnicoGet = true;
      }
      if(res[0]['estado'] == "Activo"){
        //console.log('tecnico activo');
        this.estadoTecnicoGet = false;
      }

      console.log("Respuesta de promise "+res);
      if(res == false){
        this.navCtrl.push('RegistroPage');
        //obtener datos del URL

      }else{
      }
    });
  }

  guardarTareas(){
    //mostrar
    let loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    this.userDB.getUsers().then((res) => {
      this.peticion.obtenerDatos(res[0]['cedula'])
      .subscribe(
        (data)=> {
          console.log(data);



          //data => contiene el archivo JSON obtenido desde el API web
          this.tareas.saveDataJSON(data).then(response =>{

            setTimeout(() => {
              loading.dismiss();
            }, 0);

            this.userDB.updateEstado('Activo', res[0]['id_user']).then(resAux =>{
              if(resAux){
                this.estadoTecnicoGet=false;
                this.toast.show('Técnico Activo', '5000', 'center').subscribe();
                this.ingresarItemsParaFiltrar();
              }
            }).catch(e => {
              this.toast.show('Error => '+ e, '5000', 'center').subscribe();
            });
          });
        },
        (error)=> {console.log(error);}
      );
    });

  }

  ingresarItemsParaFiltrar() {
    this.tareas.getListaTareas().then(data =>{
      if(data.length > 0){
        console.log(data);
        this.items = data;
        //filtrara y buscar datos de la lista
        this.items = this.items.filter((item) => {
          return item['n9meco'].toLowerCase().indexOf(
            this.searchTerm.toLowerCase()) > -1;

          });
        console.log("DATOS OBTENIDOS DE PROMISE");
        console.log(this.items);

        /** PARA BUSCAR EN TODOS LOS ATRIBUTOS DEL JSON
         * filterItems(searchTerm){
            return this.items.filter((item) => {
              return item.title.toLowerCase().
              indexOf(searchTerm.toLowerCase()) > -1 ||
                item.description.toLowerCase().
                  indexOf(searchTerm.toLowerCase()) > -1;
            });
            }
        */
      }

    });

  }

  onSearchInput(){
    this.searching = true;
   }

   mostrarTareaNot(item: any){
    console.log(item);
    this.navCtrl.push('ActividadPage', {'datosActividad': item});

   }

   enviarDatos(){
    let loading = this.loadingCtrl.create({
      content: 'Espere por favor...',
    });
    loading.present();

    this.estadoTecnicoPost = false;
    this.tareas.enviarDatosHttp().then(res =>{

      if(res){
        loading.dismiss();
        this.estadoTecnicoPost = true;
        this.toast.show('Éxito al eviar los datos', '5000', 'center').subscribe();
      } else {
        this.toast.show('Nó se enviaron los datos', '5000', 'center').subscribe();
      }
    }).catch(e => {
      this.toast.show(e,'5000', 'center').subscribe();
    });
   }

}



/*



      //actualizar el estado para evitar un nuevo envio
      this.userDB.getUsers().then((res) => {
        this.userDB.updateEstado('Pasivo', res[0]['id_user']).then(resAux =>{
          this.ingresarItemsParaFiltrar();
          if(resAux){
            this.toast.show('Técnico Pasivo', '5000', 'center').subscribe();
          }
        });
      });

  mostrarDatosJSON(){
    this.tareas.getTareas().then( data => {
      if(data != null){
        this.datos = data;
        console.log(data);

      }
    })
    .catch(e =>{
      console.log(e);
    });

  }
  */
