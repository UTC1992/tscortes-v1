import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
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
    private sqlite: SQLite,
    private toast: Toast,
    public formBuilder: FormBuilder,
    private alert: AlertController,
    private userService: UserProvider
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
      this.toast.show('Registro exitoso.', '5000', 'center').subscribe(
        toast => {
          this.navCtrl.popToRoot();
        }
      );
    }
  }


}
