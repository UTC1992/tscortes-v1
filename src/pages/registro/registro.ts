import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  registerForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alert: AlertController,
    private userService: UserProvider,
    public toastCtrl: ToastController
  ) {

    //formulario para validacion
    this.registerForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nombres: ['', [Validators.required, Validators.maxLength(45)] ],
      apellidos: ['',[Validators.required, Validators.maxLength(60)]],

    });
  }

  enviarDatos(){
    let valor = this.userService.saveData(this.registerForm);
    if(valor){
      this.showToast('Registro exitoso');
      this.navCtrl.popToRoot();
    } else {
      this.showToast('No se pudo registrar');
    }
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
