import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,
   AlertController, ToastController,
   LoadingController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { Toast } from '@ionic-native/toast';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TareasProvider } from '../../providers/tareas/tareas';


@IonicPage()
@Component({
  selector: 'page-actividad',
  templateUrl: 'actividad.html',
})
export class ActividadPage {

  dataActividad: any[] = [];

  myphoto: string;

  fecha = new Date();
  fechaActual = this.fecha.getDate()+"-"+(this.fecha.getMonth() +1)+"-"+this.fecha.getFullYear();

  tareaForm: FormGroup;
  nombreFoto;

  loading;

  //observacion variables
  valorObservacion;

  paginaInicial: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public file: File,
    private toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private tareaService: TareasProvider,
    public loadingCtrl: LoadingController
  ) {
    this.paginaInicial = this.navParams.get('Pagina');
    this.dataActividad = this.navParams.get('datosActividad');
    //console.log(this.dataActividad);
    this.valorObservacion = this.dataActividad['observacion'];
    this.myphoto = this.dataActividad['rutaimg'];
    //formulario para validacion
    this.tareaForm = this.formBuilder.group({
      lectura: [this.dataActividad['n9leco'], [Validators.required]],
      foto: [this.dataActividad['n9meco']+".jpeg", [Validators.required] ],
      observacion: [this.valorObservacion+"",]
    });

    // observacion: [this.dataActividad['observacion'],[Validators.required]],
    this.getFoto();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ActividadPage');
    //this.crearCarpeta();
  }

  getFoto(){
    if(this.dataActividad['rutaimg'] != null){
      this.file.readAsDataURL(this.dataActividad['rutaimg'],this.dataActividad['foto']).then(fotoBase64 => {
        //console.log(fotoBase64);
        this.myphoto = fotoBase64;
      });
    }
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
     //console.log('data:image/jpeg;base64,' + imageData);

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
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() +1;
    var anio = fecha.getFullYear();

    //creando directorio
    var nombreCarpeta = "Fotos-"+dia+"-"+mes+"-"+anio;
    var nombreFoto = this.dataActividad['n9meco']+".jpeg";
    let result = this.file.createDir(this.file.externalRootDirectory, nombreCarpeta, true);
    //let result = this.file.createFile(this.file.externalRootDirectory+"Fotos/","hola.txt",true);

    //guardando imagen en directorio creado
    result.then(data => {
      var dataAux = this.myphoto.split(',')[1];
      let blob = this.b64toBlob(dataAux, 'image/jpeg');
      this.file.writeFile(data.toURL(), nombreFoto, blob ,{replace: true})
      .then(res => {
        //console.log("RUTA DE IMAGEN ==> "+ data.toURL());

        //console.log("Foto guardada exitosamente");
        //this.toast.show('Actualización correcta.', '5000', 'center').subscribe();
        let valor = this.tareaService.update(this.tareaForm, this.dataActividad['id_tare'],data.toURL(), this.valorObservacion)
        .then((resUpdate) => {
          if(resUpdate){
            this.loading.dismiss();
            this.navCtrl.setRoot(this.paginaInicial);
            this.showToast('Datos actualizados correctamente');
          } else {
            this.showToast('Error al actualizar los datos');
          }

        });

      });

    });
    //externalDataDirectory ==> crea un archivo en el directorio de la aplicacion en la carpeta FILE
    //externalRootDirectory ==> crea el archivo en la raiz del directorio local junto a DCIM entre ellos


  }

  actualizarTarea(){

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

}
