import { Component } from '@angular/core';
import { IonicPage, NavController,
        NavParams, AlertController,
        LoadingController, ToastController } from 'ionic-angular';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { RecmanualProvider } from '../../providers/recmanual/recmanual';

import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-recnueva',
  templateUrl: 'recnueva.html',
})
export class RecnuevaPage {

  registerForm: FormGroup;
  myphoto: string;

  fecha = new Date();
  fechaActual = this.fecha.getDate()+"-"+(this.fecha.getMonth() +1)+"-"+this.fecha.getFullYear();
  fotoNombre: string;

  loading;

  //observaciones
  valorObservacion;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private camera: Camera,
    public file: File,
    public loadingCtrl: LoadingController,
    public recmanualDB: RecmanualProvider,
    public alertCtrl: AlertController,
    public toast: Toast,
    public toastCtrl: ToastController
  ){

    //formulario para validacion
    this.registerForm = this.formBuilder.group({
      medidor: ['', [Validators.required] ],
      lectura: ['', [Validators.required] ],
      foto: [this.fotoNombre, ],
      observacion: [this.valorObservacion, ],
      fecha: [this.fechaActual+"", ],

    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RecnuevaPage');
  }

  takePhoto(){

    //mostrar camara para tomar la foto
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

    //nombre de la foto
    this.fotoNombre = this.registerForm.value.medidor+".jpeg";
    //console.log(this.registerForm.value.medidor);

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
    //console.log('Guardando fotos');
    //console.log(this.myphoto);

    //nombre de foto
    this.fotoNombre = this.registerForm.value.medidor+".jpeg";
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
        //console.log("Foto guardada exitosamente");
        //this.toast.show('Actualización correcta.', '5000', 'center').subscribe();
        //console.log(this.valorObservacion);
          let valor = this.recmanualDB.insert(this.registerForm, data.toURL(), this.valorObservacion)
          .then((resUpdate) => {

            if(resUpdate){
              this.loading.dismiss();
              this.navCtrl.setRoot('RecmanualPage');
              this.showMensaje('Éxito !','Datos guardados correctamente');
            } else {
              this.showMensaje('Alerta !','Error al guardar los datos');
            }
          });

      });

    });

  }

  guardarRecManual(){

    this.loading = this.loadingCtrl.create({
      content: 'Guardando datos...'
    });
    this.loading.present();

    this.guardarFoto();

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
      label: 'Sin novedad',
      value: 'Sin novedad',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Domicilio cerrado',
      value: 'Domicilio cerrado',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Cliente no permite accion',
      value: 'Cliente no permite accion',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Guardia no permite ingreso',
      value: 'Guardia no permite ingreso',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Armario con candado',
      value: 'Armario con candado',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Coordenadas incorrectas',
      value: 'Coordenadas incorrectas',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Servicio ya suspendido',
      value: 'Servicio ya suspendido',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Sin medidor',
      value: 'Sin medidor',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Tiene factura pagada',
      value: 'Tiene factura pagada',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Tiene prorroga de pago',
      value: 'Tiene prorroga de pago',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Datos no coinciden',
      value: 'Datos no coinciden',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor abandonado',
      value: 'Medidor abandonado',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor con contrabando',
      value: 'Medidor con contrabando',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor con desperfecto o daño',
      value: 'Medidor con desperfecto o daño',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor dentro de domicilio',
      value: 'Medidor dentro de domicilio',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor muy alto',
      value: 'Medidor muy alto',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor retirado por cliente',
      value: 'Medidor retirado por cliente',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor retirado por empresa',
      value: 'Medidor retirado por empresa',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor robado',
      value: 'Medidor robado',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor sin breaker',
      value: 'Medidor sin breaker',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Medidor sin tapa',
      value: 'Medidor sin tapa',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Cristal sucio',
      value: 'Cristal sucio',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Tornillo aislado / roto',
      value: 'Tornillo aislado / roto',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Breaker dañado',
      value: 'Breaker dañado',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Cliente se reconecto',
      value: 'Cliente se reconecto',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Calamidad domestica abonado',
      value: 'Calamidad domestica abonado',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Daño en acometida',
      value: 'Daño en acometida',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Entidad oficial',
      value: 'Entidad oficial',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Establecimiento interes social',
      value: 'Establecimiento interes social',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Pago por bancos',
      value: 'Pago por bancos',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Peticion de funcionario',
      value: 'Peticion de funcionario',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Reclamo en tramite',
      value: 'Reclamo en tramite',
      checked: false
    }).addInput({
      type: 'radio',
      label: 'Insumos perecibles/refrigerado',
      value: 'Insumos perecibles/refrigerado',
      checked: false
    });

    alert.addButton('Cerrar');
    alert.addButton({
      text: 'OK',
      handler: data => {
        //console.log(data);
        this.valorObservacion = data;
      }
    });
    alert.present();
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

  showMensaje(titulo, mensaje){
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      enableBackdropDismiss: false,
      buttons: ['OK']
    });
    alert.present();
  }

}
