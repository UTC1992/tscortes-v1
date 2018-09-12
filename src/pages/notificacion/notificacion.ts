import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

import { PeticionhttpProvider } from '../../providers/peticionhttp/peticionhttp';
import { UserProvider } from '../../providers/user/user';
import { TareasProvider } from '../../providers/tareas/tareas';

import { RegistroPage } from '../../pages/registro/registro';

@IonicPage()
@Component({
  selector: 'page-notificacion',
  templateUrl: 'notificacion.html',
})
export class NotificacionPage {

  dataJSON;

  datos;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public peticion: PeticionhttpProvider,
    private sqlite: SQLite,
    private toast: Toast,
    public userDB: UserProvider,
    public tareas: TareasProvider
  ) {
  }

  ionViewDidLoad() {
    this.getContarUsers();
  }

  getContarUsers(){
    this.userDB.getUsers().then((res) => {
      console.log("Respuesta de promise "+res);
      if(res == false){
        this.navCtrl.push(RegistroPage);
      }else{
        this.peticion.obtenerDatos()
        .subscribe(
          (data)=> {
            this.dataJSON = data;
            console.log(this.dataJSON[0].name);
          },
          (error)=> {console.log(error);}
        );

        this.mostrarDatosJSON();
      }
    });
  }

  guardarTareas(){
    this.tareas.saveDataJSON(this.dataJSON);
  }

  mostrarDatosJSON(){
  this.tareas.getTareas().then( data => {
    if(data != null){
      this.datos = data;
      console.log(data);
    }
  })
  .catch(e =>{
    console.log(e);
  });


  }

  /*
  saveData() {
    console.log("Almacenando datos obtenidos de webService");
    this.sqlite.create({
      name: 'empresacortes.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      for (let i = 0; i < this.usuarios.length; i++) {
        db.executeSql('INSERT INTO ejemplo ( name, username, email) VALUES(?,?,?)',
                  [this.usuarios[i].name,this.usuarios[i].username, this.usuarios[i].email])
        .then(res => {
          console.log(res);
          this.toast.show('Registrado!', '4000', 'center').subscribe();
        })
        .catch(e => {
          console.log(e);
          this.toast.show("El Usuario ya existe!", '4000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
      }

      }).catch(e => {
        console.log(e);
        this.toast.show("Error!", '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      });

      this.mostrarDatosJSON();
  }

  mostrarDatosJSON(){
    this.sqlite.create({
      name: 'empresacortes.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM ejemplo ORDER BY id DESC', [])
        .then(res => {
          this.datos = [];
          for (var i = 0; i < res.rows.length; i++) {
            this.datos.push({
                                id: res.rows.item(i).id,
                                name: res.rows.item(i).name,
                                username: res.rows.item(i).username,
                                email: res.rows.item(i).email
                              })
          }

        });
    });
  }
*/


}
