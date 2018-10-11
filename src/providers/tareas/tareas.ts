import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TareaModel } from '../../models/tareamodel';

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
                    +" id_act INTEGER,"
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
                    +" latitud TEXT,"
                    +" longitud TEXT,"
                    +" foto TEXT,"
                    +" rutaimg TEXT,"
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
                                      id_act: data.rows.item(i).id_act,
                                      n9cono: data.rows.item(i).n9cono,
                                      n9cocu: data.rows.item(i).n9cocu,
                                      n9cose: data.rows.item(i).n9cose,
                                      n9coru: data.rows.item(i).n9coru,
                                      n9plve: data.rows.item(i).n9plve,
                                      n9vaca: data.rows.item(i).n9vaca,
                                      n9meco: data.rows.item(i).n9meco,
                                      n9leco: data.rows.item(i).n9leco,
                                      n9cocl: data.rows.item(i).n9cocl,
                                      n9nomb: data.rows.item(i).n9nomb,
                                      n9refe: data.rows.item(i).n9refe,
                                      cusecu: data.rows.item(i).cusecu,
                                      cucoon: data.rows.item(i).cucoon,
                                      cucooe: data.rows.item(i).cucooe,
                                      latitud: data.rows.item(i).latitud,
                                      longitud: data.rows.item(i).longitud,
                                      foto: data.rows.item(i).foto,
                                      rutaimg: data.rows.item(i).rutaimg,
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
                                  +" ( id_act, n9cono, n9cocu, n9cose, n9coru, n9meco,"
                                  +" n9leco, n9cocl, n9nomb, n9refe, cusecu, cucoon, foto, "
                                  +" observacion, fecha, hora, estado, cedula_emp, id_tecn,"
                                  +" n9plve, n9vaca, cucooe, latitud, longitud) "
                                  +" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                      dataJSON[i].id_act, dataJSON[i].n9cono, dataJSON[i].n9cocu,
                      dataJSON[i].n9cose, dataJSON[i].n9coru, dataJSON[i].n9meco,
                      dataJSON[i].n9leco, dataJSON[i].n9cocl, dataJSON[i].n9nomb,
                      dataJSON[i].n9refe, dataJSON[i].cusecu, dataJSON[i].cucoon,
                      dataJSON[i].foto, dataJSON[i].observacion, dataJSON[i].fecha,
                      dataJSON[i].hora, dataJSON[i].estado, dataJSON[i].cedula_emp,
                      dataJSON[i].id_tecn,
                      dataJSON[i].n9plve, dataJSON[i].n9vaca, dataJSON[i].cucooe,
                      dataJSON[i].latitud, dataJSON[i].longitud
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

  }

  update(data: FormGroup, id: number, rutaimg: any){
    return new Promise((resolve, reject) => {
      if (data.valid){
        console.log(data.value.lectura);
        console.log(" ID tarea a actualizar ==>" + id);
        return this.openDatabase().then(res =>{
          if(res){
            return this.database.executeSql(
              'UPDATE tareas SET n9leco=?, foto=?, observacion=?, estado=?, rutaimg=? WHERE id_tare=?'
              ,[data.value.lectura,data.value.foto,data.value.observacion, 2, rutaimg, id])
            .then(response =>{
              console.log("ACTUALIZAR TAREA");
              console.log(response['rowsAffected']);
              resolve(true);
            })
            .catch(e =>{
              console.log(e);
              reject(false);
            })
          }
        }).catch(e => {
          console.log(e);
          reject(false);
        });
      }
    });

  }

  enviarDatosHttp(){
    return new Promise((resolve, reject) =>{
    return this.getListaTareas().then(data => {

      let headers = new HttpHeaders({
        "Accept": 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      //console.log(JSON.stringify(data));

      return this.http.post("http://192.168.1.6/AppIonicLaravel-Empresa/ServiceSistemaGestion/public/api/mobile/update-activities", JSON.stringify(data), {headers: headers})
        .subscribe(res => {
          console.log("Respuesta del servidor es ==> ");
          console.log(res);
          resolve(res);
        }, error => {
          console.log(error);
          reject(false);
        });

    });

    });
  }

  public getCoordenadas(): Promise<string[]>{
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
                                      n9meco: data.rows.item(i).n9meco,
                                      latitud: data.rows.item(i).latitud,
                                      longitud: data.rows.item(i).longitud,

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
}

/*
      for (var i = 0; i < data.length; i++) {
        //this.listaTareas[i] = data.rows.item(i).n9nomb;

        tareasArray.push(new TareaModel(  data[i]['id_tare'],
                                          data[i]['id_act'],
                                          data[i]['n9cono'],
                                          data[i]['n9cocu'],
                                          data[i]['n9cose'],
                                          data[i]['n9coru'],
                                          data[i]['n9plve'],
                                          data[i]['n9vaca'],
                                          data[i]['n9meco'],
                                          data[i]['n9leco'],
                                          data[i]['n9cocl'],
                                          data[i]['n9nomb'],
                                          data[i]['n9refe'],
                                          data[i]['cusecu'],
                                          data[i]['cucoon'],
                                          data[i]['cucooe'],
                                          data[i]['foto'],
                                          data[i]['rutaimg'],
                                          data[i]['observacion'],
                                          data[i]['fecha'],
                                          data[i]['hora'],
                                          data[i]['estado'],
                                          data[i]['cedula_emp'],
                                          data[i]['id_tecn']
                                        ));


      }
    */
    //console.log(JSON.stringify(tareasArray));

