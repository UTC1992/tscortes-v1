import { Component } from '@angular/core';
import {  IonicPage, NavController,
          NavParams, AlertController, ToastController,
          LoadingController } from 'ionic-angular';

import { Toast } from '@ionic-native/toast';

import { PeticionhttpProvider } from '../../providers/peticionhttp/peticionhttp';
import { UserProvider } from '../../providers/user/user';
import { TareasProvider } from '../../providers/tareas/tareas';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { File } from '@ionic-native/file';

import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-corte',
  templateUrl: 'corte.html',
})
export class CortePage {

  tipoActividad1 = '30';
  tipoActividad2 = '030';

  dataJSON;

  searchTerm: string = '';
  items: any[] = [];
  searchControl: FormControl;
  searching: any = false;

  estadoTecnicoGet: boolean;
  estadoTecnicoEnvio: boolean;

  //creacion de archivo GPX
  fileName: string;
  fileContenido: string;
  dirName: string;
  dirPath;

  //info de actividades hechas y faltantes
  actFaltantes: number;
  actHechas: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public peticion: PeticionhttpProvider,
    private toastCtrl: ToastController,
    public userDB: UserProvider,
    public tareas: TareasProvider,
    public loadingCtrl: LoadingController,
    public file: File,
  ) {

    this.searchControl = new FormControl();
    this.estadoTecnicoEnvio = true;
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
      if(res[0]['estado'] == "Inactivo" || res[0]['estado'] == null){
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
            this.userDB.updateEstado('Activo', res[0]['id_user']).then(resAux =>{
              if(resAux){
                setTimeout(() => {
                  loading.dismiss().then(r =>{
                    this.estadoTecnicoGet=false;
                    this.showToast('Técnico activo');
                    this.ingresarItemsParaFiltrar();
                  });
                }, 5000);

              }  else {
                loading.dismiss().then(r =>{
                  this.estadoTecnicoGet=true;
                  this.showToast('Datos no obtenidos');
                });
              }
            }).catch(e => {
              loading.dismiss();
              this.estadoTecnicoGet=true;
              this.showToast('Error => '+ e);
            });
          });
        },
        (error)=> {
          console.log(error);
          loading.dismiss();
          this.estadoTecnicoGet=true;
          this.showToast('No se pudo obtener los datos');
        }
      );
    });

  }

  ingresarItemsParaFiltrar() {
    this.tareas.getListaTareas(this.tipoActividad1, this.tipoActividad2).then(data =>{
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
      this.infoActividadesHechasFaltantes();
    });

  }

  infoActividadesHechasFaltantes(){
    this.tareas.getListaTareas(this.tipoActividad1,this.tipoActividad2).then(data1 =>{
      this.tareas.contarActividadesHechasYFaltantes(this.tipoActividad1, this.tipoActividad2).then(data2 =>{
        //faltantes
        this.actFaltantes = data1.length;
        this.actHechas = data2 - this.actFaltantes;
      });
    });

  }

  onSearchInput(){
    this.searching = true;
   }

   mostrarTareaNot(item: any){
    //console.log(item);
    let loading = this.loadingCtrl.create({
      content: 'Obtener datos...'
    });
    loading.present();
    loading.dismiss();
    this.navCtrl.push('ActividadPage', {'datosActividad': item});
   }

   enviarDatos(){
     //desactivar boton
    this.estadoTecnicoEnvio = false;
    let loading = this.loadingCtrl.create({
      content: 'Enviando datos...'
    });
    loading.present();

    this.tareas.enviarDatosHttp(this.tipoActividad1, this.tipoActividad2).then(res =>{
      if(res){
        setTimeout(() => {
          loading.dismiss().then(r =>{
            this.estadoTecnicoEnvio = true;
            this.showToast('Éxito al eviar los datos');
          });
        }, 0);

      } else {
        setTimeout(() => {
          loading.dismiss().then(r =>{
            this.estadoTecnicoEnvio = true;
            this.showToast('Nó se enviaron los datos');
          });
        }, 0);
      }
    }).catch(e => {
      loading.dismiss();
      this.estadoTecnicoEnvio = true;
      this.showToast('Error al enviar los datos');

    });

   }

   generarGPX(){
     //cargando
    let loading = this.loadingCtrl.create({
      content: 'Creando ruta...'
    });
    loading.present();

    this.fileName='coordenadas.gpx';
    this.dirName='coordenadasGPX';

    let result = this.file.createDir(this.file.externalRootDirectory, this.dirName, true);
    result.then(data => {
      this.dirPath = data.toURL();
      this.tareas.getCoordenadas(this.tipoActividad1, this.tipoActividad2).then(data =>{
        let headerGPX = "<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>"
                      +" <gpx 	version='1.1'"
                      +" creator='OsmAnd' xmlns='http://www.topografix.com/GPX/1/1'"
                      +" xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'"
                      +" xsi:schemaLocation='http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd'>";
      let bodyGPX = "";
        if(data.length > 0){
          console.log(data[0]);
          for (let i = 0; i < data.length; i++) {

            bodyGPX = bodyGPX + "<wpt lat='"+data[i]['latitud']+"' lon='"+data[i]['longitud']+"'>"
                        +" <name>"+data[i]['n9meco']+"</name>"
                        +" <extensions>"
                        +" <color>#2196f3</color>"
                        +" </extensions>"
                        +" </wpt>";

          }
        }

      let footGPX="</gpx>";

      let gpxFile = headerGPX+bodyGPX+footGPX;
      //console.log(gpxFile);
      this.file.writeFile(this.dirPath, this.fileName, gpxFile, {replace:true}).then(r =>{
        setTimeout(() => {
          loading.dismiss().then(res =>{
            this.showToast('Ruta creada con éxito, revisar la carpeta coordenadaGPX');
          });
        }, 0);
      });

      });


    });

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
