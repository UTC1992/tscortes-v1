import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Injectable()
export class RecmanualProvider {

  public database: SQLiteObject;

  listaRecM;

  constructor(
    public http: HttpClient,
    public sqlite: SQLite
    ) {
      console.log('Hello Recmanual Provider');
  }

  public openDatabase(){
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'empresacortes.db',
        location: 'default'
      })
      .then((db : SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS recmanual("
                    +" id_recm INTEGER PRIMARY KEY AUTOINCREMENT,"
                    +" medidor TEXT,"
                    +" lectura TEXT,"
                    +" foto TEXT,"
                    +" observacion TEXT,"
                    +" fecha TEXT"
                    + ")",[])
        .then(() => console.log('Tabla RECMANUAL Creada'))
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

  insert(data: FormGroup){
    return new Promise((resolve, reject) => {
      if (data.valid){
        console.log(data.value);
        return this.openDatabase().then((res) =>{
          if(res){
            this.database.executeSql("INSERT INTO recmanual"
                                            +" (medidor, lectura, foto, observacion, fecha)"
                                            +" VALUES(?,?,?,?,?)",
                                            [
                                            data.value.medidor,data.value.lectura,
                                            data.value.foto, data.value.observacion,
                                            data.value.fecha
                                            ])
            .then(response =>{
              console.log("INSERCION DE RECMANUAL");
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

  update(data: FormGroup, id: number){
    return new Promise((resolve, reject) => {
      if (data.valid){
        console.log(data.value);
        return this.openDatabase().then(res =>{
          if(res){
            return this.database.executeSql(
              "UPDATE recmanual SET medidor=?, lectura=?, foto=?, observacion=?, fecha=? WHERE id_recm=?"
              ,[data.value.medidor,data.value.lectura,
                data.value.foto, data.value.observacion,
                data.value.fecha, id ])
            .then(response =>{
              console.log("ACTUALZIACION DE RECMANUAL");
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

  getListaRecM(): Promise<string[]>{
    return new Promise((resolve, reject)=>{
      return this.openDatabase().then((res) => {
        console.log("Respuesta de las promesas "+res);
        if(res){
          return this.database.executeSql("SELECT * FROM recmanual ORDER BY id_recm ASC",
          [])
          .then((data) => {
            console.log("Consulta realizada a RECMANUAL");
            this.listaRecM = [];
            for (var i = 0; i < data.rows.length; i++) {
                this.listaRecM.push({
                  id_recm: data.rows.item(i).id_recm,
                  medidor: data.rows.item(i).medidor,
                  lectura: data.rows.item(i).lectura,
                  foto: data.rows.item(i).foto,
                  observacion: data.rows.item(i).observacion,
                  fecha: data.rows.item(i).fecha
                });


            }
            //console.log(this.listaTareas);
            if(this.listaRecM.length > 0){
              resolve(this.listaRecM);
            } else {
              resolve(this.listaRecM);
            }

          }, (error) =>{
            console.log("ERROR en consulta de RECMANUAL: " + error);

            reject(false);
          });
        }
      });
    })
  }

  enviarDatosHttp(){
    return new Promise((resolve, reject) =>{
    return this.getListaRecM().then(data => {

      let headers = new HttpHeaders({
        "Accept": 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      //console.log(JSON.stringify(data));

      return this.http.post("http://192.168.1.4/AppIonicLaravel-Empresa/ServiceSistemaGestion/public/api/mobile/insert-data", JSON.stringify(data), {headers: headers})
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

}
