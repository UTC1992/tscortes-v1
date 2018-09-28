import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  registerForm: FormGroup;
  usuarios;
  user:any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast,
    public formBuilder: FormBuilder,
    private alert: AlertController,
    private userDB: UserProvider
  ) {

    //formulario para validacion
    this.registerForm = this.formBuilder.group({
      cedula: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nombres: ['', [Validators.required, Validators.maxLength(45)] ],
      apellidos: ['',[Validators.required, Validators.maxLength(60)]],

    });

  }

  ionViewDidLoad() {
    this.getContarUsers();
  }

  getContarUsers(){
    this.userDB.getUsers().then((res) => {
      console.log("Respuesta de promise en PERFIL "+res);
      if(res == false){
        this.user = [];
        this.navCtrl.push('RegistroPage');
      }else{
        console.log(res);
        this.user = res[0];
      }
    });
  }

  updatePerfil(){
    let valor = this.userDB.actualizar(this.registerForm, this.user['id_user']).then((res) =>{
      if(valor){
        this.toast.show('Perfil actualizado correctamente.', '4000', 'center')
        .subscribe();
      }
      if(!valor){
        this.toast.show('Error al actualizar el perfil.', '4000', 'center')
        .subscribe();
      }
    });


  }



}
