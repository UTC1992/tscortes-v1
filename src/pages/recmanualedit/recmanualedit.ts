import { Component } from '@angular/core';
import { IonicPage, NavController,
          NavParams,
          LoadingController, AlertController  } from 'ionic-angular';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { RecmanualProvider } from '../../providers/recmanual/recmanual';

@IonicPage()
@Component({
  selector: 'page-recmanualedit',
  templateUrl: 'recmanualedit.html',
})
export class RecmanualeditPage {

  registerForm: FormGroup;
  myphoto: string;
  fotoNombre: string;

  fecha = new Date();
  fechaActual = this.fecha.getDate()+"-"+(this.fecha.getMonth() +1)+"-"+this.fecha.getFullYear();

  dataRecManual: any[] = [];

  loading;

  //alert con opciones
  testRadioOpen;
  testRadioResult;

  //observacion variables
  valorObservacion;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private camera: Camera,
    public file: File,
    public loadingCtrl: LoadingController,
    public recmanualDB: RecmanualProvider,
    public alertCtrl: AlertController
  ) {

    this.dataRecManual = this.navParams.get('datosRecManual');
    console.log(this.dataRecManual);
    this.valorObservacion = this.dataRecManual['observacion'];

    //formulario para validacion
    this.registerForm = this.formBuilder.group({
      medidor: [this.dataRecManual['medidor'], [Validators.required] ],
      lectura: [this.dataRecManual['lectura'], [Validators.required] ],
      foto: [this.dataRecManual['foto'], ],
      observacion: [this.valorObservacion, ],
      fecha: [this.dataRecManual['fecha'], ],

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecmanualeditPage');
  }

  takePhoto(){

    //mostrar camara para tomar la foto
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

    //nombre de la foto
    this.fotoNombre = this.registerForm.value.medidor+".jpeg";
    console.log(this.registerForm.value.medidor);

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

  guardarFoto(){
    console.log('Guardando fotos');
    console.log(this.myphoto);

    //creando directorio
    var nombreCarpeta = "Fotos-"+this.fechaActual+"RECMA";
    var nombreFoto = this.registerForm.value.medidor+".jpeg";
    let result = this.file.createDir(this.file.externalRootDirectory, nombreCarpeta, true);
    //let result = this.file.createFile(this.file.externalRootDirectory+"Fotos/","hola.txt",true);

    //guardando imagen en directorio creado
    result.then(data => {
      var dataAux = this.myphoto.split(',')[1];
      let blob = this.b64toBlob(dataAux, 'image/jpeg');
      this.file.writeFile(data.toURL(), nombreFoto, blob ,{replace: true})
      .then(res => {
        this.loading.dismiss();
        console.log("Foto guardada exitosamente");
        //this.toast.show('Actualización correcta.', '5000', 'center').subscribe();
        this.navCtrl.setRoot('RecmanualPage');

      });

    });

  }

  guardarRecManual(){
    this.loading = this.loadingCtrl.create({
      content: 'Guardando datos...'
    });
    this.loading.present();

    let valor = this.recmanualDB.insert(this.registerForm)
    .then((res) => {
      let respuesta = this.guardarFoto();
    });
  }

  descartarFoto(){
    this.myphoto = "";
  }

  opcionesObservacion(){
    let alert = this.alertCtrl.create({
      cssClass: 'custom-alert-danger'
    });
    alert.setTitle('Elija una opción:');

    alert.addInput({
      type: 'radio',
      label: 'El domicilio se encuentra desabitado hola mundo hola mundo hola mundo hola mundo hola mundo hola mundo',
      value: 'El domicilio se encuentra desabitado hola mundo hola mundo hola mundo hola mundo hola mundo hola mundo',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Perro Bravo',
      value: 'Perro Bravo',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Perro Bravo',
      value: 'Perro Bravo',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Perro Bravo',
      value: 'Perro Bravo',
      checked: false
    });

    alert.addButton('Cerrar');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
        this.valorObservacion = data;
      }
    });
    alert.present();
  }
}
