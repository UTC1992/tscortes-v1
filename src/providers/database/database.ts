import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DatabaseProvider {

  public database: SQLiteObject;
  users: any[] = [];

  constructor(
    public http: HttpClient,
    public sqlite: SQLite
  ) {
    console.log('Hello DatabaseProvider Provider');
  }

  public openDatabase(){
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'empresacortes.db',
        location: 'default'
      })
      .then((db : SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS users("
                    +" id_user INTEGER PRIMARY KEY AUTOINCREMENT,"
                    +" cedula TEXT,"
                    +" nombres TEXT,"
                    +" apellidos TEXT"
                    + ");"
                    , [])
        .then(() => console.log('Tabla Users Creada'))
        .catch(e => console.log(e));

        this.database = db;
        resolve(true);
      })
      .catch(error =>{
        console.error(error);
        reject(false);
      });
    });

  }

  public getUsers(){
    return new Promise((resolve, reject)=>{
      return this.openDatabase().then((res) => {
        console.log("Respuesta de las promesas"+res);
        if(res){
          return this.database.executeSql('SELECT * FROM users ORDER BY id_user DESC', [])
          .then((data) => {
            console.log("Consulta realizada a USERS");
            this.users = [];
            for (var i = 0; i < data.rows.length; i++) {
              this.users.push({
                                  id_user: data.rows.item(i).id_user,
                                  cedula: data.rows.item(i).cedula,
                                  nombres: data.rows.item(i).nombres,
                                  apellidos: data.rows.item(i).apellidos
                                })
            }
            if(this.users.length > 0){
              resolve(this.users);
            } else {
              resolve(false);
            }

          }, (error) =>{
            console.log("ERROR en consulta de susuarios: " + error);

            reject(false);
          });
        }
      });
    })
  }



}
