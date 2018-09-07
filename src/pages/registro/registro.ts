import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  data = { cedula:"", nombres:"", apellidos:"" };

  registerForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast,
    public formBuilder: FormBuilder,
    private alert: AlertController
  ) {

    //formulario para validacion
    this.registerForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nombres: ['', [Validators.required, Validators.maxLength(45)] ],
      apellidos: ['',[Validators.required, Validators.maxLength(60)]],

    });
  }

  saveData() {
    if (this.registerForm.valid){
    this.sqlite.create({
      name: 'empresacortes.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO users ( cedula, nombres, apellidos) VALUES(?,?,?)',
                  [this.registerForm.value.cedula,this.registerForm.value.nombres,this.registerForm.value.apellidos])
        .then(res => {
          console.log(res);

          this.toast.show('Estas Registrado!', '4000', 'center').subscribe(
            toast => {
              this.navCtrl.popToRoot();
            }
          );

        })
        .catch(e => {
          console.log(e);
          this.toast.show("El Usuario ya existe!", '4000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
      }).catch(e => {
        console.log(e);
        this.toast.show("Error!", '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      });
    }
  }

}
