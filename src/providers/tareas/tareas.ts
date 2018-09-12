import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class TareasProvider {

  public database: SQLiteObject;
  tareas: any[] = [];
  registerForm: FormGroup;

  constructor(
    public http: HttpClient,
    public sqlite: SQLite
  ) {
    console.log('Hello TAREAS Provider');
  }

  public openDatabase(){
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'empresacortes.db',
        location: 'default'
      })
      .then((db : SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS tareas("
                    +" id_tare INTEGER PRIMARY KEY AUTOINCREMENT,"
                    +" id_user INTEGER,"
                    +" n9cono TEXT,"
                    +" n9cocu TEXT,"
                    +" n9cose TEXT,"
                    +" n9coru TEXT,"
                    +" n9plve TEXT,"
                    +" n9vaca TEXT,"
                    +" n9meco TEXT,"
                    +" n9leco TEXT,"
                    +" n9nomb TEXT,"
                    +" n9refe TEXT,"
                    +" n9cobs TEXT,"
                    +" observacion TEXT"
                    + ")",[])
        .then(() => console.log('Tabla TAREAS Creada'))
        .catch(e => console.log(e));

        this.database = db;
        resolve(db);
      })
      .catch(error =>{
        console.error(error);
        reject(false);
      });
    });

  }

  public getTareas(){
    return new Promise((resolve, reject)=>{
      return this.openDatabase().then((res) => {
        console.log("Respuesta de las promesas "+res);
        if(res){
          return this.database.executeSql('SELECT * FROM tareas ORDER BY id_tare ASC', [])
          .then((data) => {
            console.log("Consulta realizada a TAREAS");
            this.tareas = [];
            for (var i = 0; i < data.rows.length; i++) {
              this.tareas.push({
                                id_tare: data.rows.item(i).id_tare,
                                n9nomb: data.rows.item(i).n9nomb
                              })
            }
            if(this.tareas.length > 0){
              resolve(this.tareas);
            } else {
              resolve(false);
            }

          }, (error) =>{
            console.log("ERROR en consulta de TAREAS: " + error);

            reject(false);
          });
        }
      });
    })
  }

  saveDataJSON(dataJSON) {
    return new Promise((resolve, reject) => {
      console.log("Almacenando datos obtenidos de webService");
      return this.openDatabase().then((res) => {
        for (let i = 0; i < dataJSON.length; i++) {
          this.database.executeSql('INSERT INTO tareas ( n9nomb ) VALUES(?)',
                    [dataJSON[i].name])
          .then(res => {
            console.log(res);
            resolve(true);
          })
          .catch(e => {
            console.log(e);
            reject(false);
          });
        }
        resolve(true);
        }).catch(e => {
          console.log(e);
          reject(false);
        });
    });


      //this.mostrarDatosJSON();
  }


}
