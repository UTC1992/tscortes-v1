import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

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
    private camera: Camera
  ) {
    this.dataActividad = this.navParams.get('datosActividad');
    console.log(this.dataActividad);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActividadPage');
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
    }, (err) => {
     // Handle error
    });
  }

}
