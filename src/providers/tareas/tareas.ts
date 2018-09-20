import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import 'rxjs/add/operator/debounceTime';

@Injectable()
export class TareasProvider {

  public database: SQLiteObject;
  tareas: any[] = [];

  listaTareas;

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
                    +" id_temp INTEGER,"
                    +" n9cono TEXT,"
                    +" n9cocu TEXT,"
                    +" n9cose TEXT,"
                    +" n9coru TEXT,"
                    +" n9plve TEXT,"
                    +" n9vaca TEXT,"
                    +" n9meco TEXT,"
                    +" n9leco TEXT,"
                    +" n9cocl TEXT,"
                    +" n9nomb TEXT,"
                    +" n9refe TEXT,"
                    +" cusecu TEXT,"
                    +" cucoon TEXT,"
                    +" cucooe TEXT,"
                    +" foto TEXT,"
                    +" observacion TEXT,"
                    +" fecha TEXT,"
                    +" hora TEXT,"
                    +" estado TEXT,"
                    +" cedula_emp TEXT,"
                    +" id_tecn TEXT"
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

  public getListaTareas(): Promise<string[]>{
    return new Promise((resolve, reject)=>{
      return this.openDatabase().then((res) => {
        console.log("Respuesta de las promesas "+res);
        let tipoActividad1 = '10';
        let tipoActividad2 = '010';
        if(res){
          return this.database.executeSql('SELECT * FROM tareas WHERE n9cono=? or n9cono=? ORDER BY id_tare ASC',
          [tipoActividad1, tipoActividad2])
          .then((data) => {
            console.log("Consulta realizada a TAREAS");
            this.listaTareas = [];
            for (var i = 0; i < data.rows.length; i++) {
              //this.listaTareas[i] = data.rows.item(i).n9nomb;
              this.listaTareas.push({
                                      id_tare: data.rows.item(i).id_tare,
                                      id_temp: data.rows.item(i).id_temp,
                                      n9cono: data.rows.item(i).n9cono,
                                      n9cocu: data.rows.item(i).n9cocu,
                                      n9cose: data.rows.item(i).n9cose,
                                      n9coru: data.rows.item(i).n9coru,
                                      n9plve: null,
                                      n9vaca: null,
                                      n9meco: data.rows.item(i).n9meco,
                                      n9leco: data.rows.item(i).n9leco,
                                      n9cocl: data.rows.item(i).n9cocl,
                                      n9nomb: data.rows.item(i).n9nomb,
                                      n9refe: data.rows.item(i).n9refe,
                                      cusecu: data.rows.item(i).cusecu,
                                      cucoon: data.rows.item(i).cucoon,
                                      cucooe: null,
                                      foto: data.rows.item(i).foto,
                                      observacion: data.rows.item(i).observacion,
                                      fecha: data.rows.item(i).fecha,
                                      hora: data.rows.item(i).hora,
                                      estado: data.rows.item(i).estado,
                                      cedula_emp: data.rows.item(i).cedula_emp,
                                      id_tecn: data.rows.item(i).id_tecn
                                    });
            }

            if(this.listaTareas.length > 0){
              resolve(this.listaTareas);
            } else {
              resolve(this.listaTareas);
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
          this.database.executeSql("INSERT INTO tareas"
                                  +" ( id_temp, n9cono, n9cocu, n9cose, n9coru, n9meco,"
                                  +" n9leco, n9cocl, n9nomb, n9refe, cusecu, cucoon, foto, "
                                  +" observacion, fecha, hora, estado, cedula_emp, id_tecn,"
                                  +" n9plve, n9vaca, cucooe) "
                                  +" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                      dataJSON[i].id_ode, dataJSON[i].n9cono, dataJSON[i].n9cocu,
                      dataJSON[i].n9cose, dataJSON[i].n9coru, dataJSON[i].n9meco,
                      dataJSON[i].n9leco, dataJSON[i].n9cocl, dataJSON[i].n9nomb,
                      dataJSON[i].n9refe, dataJSON[i].cusecu, dataJSON[i].cucoon,
                      dataJSON[i].foto, dataJSON[i].observacion, dataJSON[i].fecha,
                      dataJSON[i].hora, dataJSON[i].estado, dataJSON[i].cedula_emp,
                      dataJSON[i].id_tecn, null, null, null
                    ])
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

/**
 * "CREATE TABLE IF NOT EXISTS tareas("
                    +" id_tare INTEGER PRIMARY KEY AUTOINCREMENT,"
                    +" id_temp INTEGER,"
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
 */
