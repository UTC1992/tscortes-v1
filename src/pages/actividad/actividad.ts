import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-actividad',
  templateUrl: 'actividad.html',
})
export class ActividadPage {

  dataActividad: any[] = [];

  myphoto: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public file: File
  ) {
    this.dataActividad = this.navParams.get('datosActividad');
    console.log(this.dataActividad);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActividadPage');
    //this.crearCarpeta();
  }

  takePhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.myphoto = 'data:image/jpeg;base64,' + imageData;
     console.log('data:image/jpeg;base64,' + imageData);

     //this.crearCarpeta();
    }, (err) => {
     // Handle error
    });
  }

  b64toBlob(b64Data, contenType){
    contenType = contenType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset+= sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);

      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contenType});
    return blob;
  }

  crearCarpeta(){
    console.log('Guardando fotos');
    console.log(this.myphoto);
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() +1;
    var anio = fecha.getFullYear();

    var nombreCarpeta = "Fotos-"+dia+"-"+mes+"-"+anio;
    var nombreFoto = dia+"-"+mes+"-"+anio+".jpeg";
    let result = this.file.createDir(this.file.externalRootDirectory, nombreCarpeta, true);
    //let result = this.file.createFile(this.file.externalRootDirectory+"Fotos/","hola.txt",true);

    result.then(data => {
      var dataAux = this.myphoto.split(',')[1];
      let blob = this.b64toBlob(dataAux, 'image/jpeg');
      this.file.writeFile(data.toURL(), nombreFoto, blob ,{replace: true});
    });
    //externalDataDirectory ==> crea un archivo en el directorio de la aplicacion en la carpeta FILE
    //externalRootDirectory ==> crea el archivo en la raiz del directorio local junto a DCIM entre ellos


  }

}
