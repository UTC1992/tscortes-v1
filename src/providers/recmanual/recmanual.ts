import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Injectable()
export class RecmanualProvider {

  public database: SQLiteObject;

  listaRecM;

  //url = 'http://pruebas.tiendanaturalecuador.online/api/mobile';
  url = 'http://gestiondcyk.tecnosolutionscorp.com/api/mobile';

  constructor(
    public http: HttpClient,
    public sqlite: SQLite
    ) {
      //console.log('Hello Recmanual Provider');
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
                    +" fecha TEXT,"
                    +" rutaimg TEXT"
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

  insert(data: FormGroup, rutaimg: any, observacion: any){
    return new Promise((resolve, reject) => {
      if (data.valid){
        console.log(data.value);
        return this.openDatabase().then((res) =>{
          if(res){
            this.database.executeSql("INSERT INTO recmanual"
                                            +" (medidor, lectura, foto, observacion, fecha, rutaimg)"
                                            +" VALUES(?,?,?,?,?,?)",
                                            [
                                            data.value.medidor,data.value.lectura,
                                            data.value.foto, observacion,
                                            data.value.fecha, rutaimg
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

  update(data: FormGroup, id: number, rutaimg: any, observacion: any){
    return new Promise((resolve, reject) => {
      if (data.valid){
        console.log(data.value);
        return this.openDatabase().then(res =>{
          if(res){
            return this.database.executeSql(
              "UPDATE recmanual SET medidor=?, lectura=?, foto=?, observacion=?, fecha=?, rutaimg=? WHERE id_recm=?"
              ,[data.value.medidor,data.value.lectura,
                data.value.foto, observacion,
                data.value.fecha, rutaimg, id ])
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
            let index = 1;
            for (var i = 0; i < data.rows.length; i++) {
                this.listaRecM.push({
                  index: index++,
                  id_recm: data.rows.item(i).id_recm,
                  medidor: data.rows.item(i).medidor,
                  lectura: data.rows.item(i).lectura,
                  foto: data.rows.item(i).foto,
                  observacion: data.rows.item(i).observacion,
                  fecha: data.rows.item(i).fecha,
                  rutaimg: data.rows.item(i).rutaimg
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

  enviarDatosHttp(cedula: any){
    return new Promise((resolve, reject) =>{
    return this.getListaRecM().then(data => {

      let headers = new HttpHeaders({
        "Accept": 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      let objCedula: any = {
        cedula: cedula
      };
      //añadir objeto al data obtenido
      data.push(objCedula);
      console.log(data);

      return this.http.post(this.url+'/insert-data', JSON.stringify(data), {headers: headers})
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

  delete(id: number){
    return new Promise((resolve, reject) => {
        return this.openDatabase().then(res =>{
          if(res){
            return this.database.executeSql(
              "DELETE FROM recmanual WHERE id_recm=?"
              ,[ id ])
            .then(response =>{
              console.log("ELIMINAR RECMANUAL");
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
    });
  }

  contarRecManual(): Promise<number>{
    return new Promise((resolve, reject) =>{
      return this.openDatabase().then((res) => {
        return this.database.executeSql("SELECT COUNT(*) as 'actTotal' FROM recmanual",
        []).then((data) =>{
          console.log("Total de recmanual obtenidas");
          console.log(data.rows.item(0).actTotal);
          resolve(data.rows.item(0).actTotal);
        }).catch(error =>{
          reject(false);
        });
      });
    });
  }

  clearTables(){
    return new Promise((resolve, reject) =>{
      return this.openDatabase().then(res =>{
        this.database.executeSql('DELETE FROM recmanual'
                                ,[])
        .then(r => {
          console.log(r);
          resolve(true);
        }).catch(error => {
          console.log(error);
          reject(false);
        });
      });
    });
  }


}
