import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

import { PeticionhttpProvider } from '../../providers/peticionhttp/peticionhttp';
import { UserProvider } from '../../providers/user/user';
import { TareasProvider } from '../../providers/tareas/tareas';

import { RegistroPage } from '../../pages/registro/registro';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActividadPage } from '../../pages/actividad/actividad';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public peticion: PeticionhttpProvider,
    private sqlite: SQLite,
    private toast: Toast,
    public userDB: UserProvider,
    public tareas: TareasProvider
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
        this.navCtrl.push(RegistroPage);
        //obtener datos del URL

      }else{
      }
    });
  }

  guardarTareas(){
    this.peticion.obtenerDatos()
      .subscribe(
        (data)=> {
          this.tareas.saveDataJSON(this.dataJSON).then(response =>{
            this.ingresarItemsParaFiltrar();
          });
        },
        (error)=> {console.log(error);}
      );
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
    this.navCtrl.push(ActividadPage, {'datosActividad': item});

   }

}

/*
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
