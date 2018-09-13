import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class UserProvider {

  public database: SQLiteObject;
  users: any[] = [];
  registerForm: FormGroup;

  constructor(
    public http: HttpClient,
    public sqlite: SQLite
  ) {
    console.log('Hello USER Provider');
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
        resolve(db);
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
        console.log("Respuesta de las promesas "+res);
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

  saveData(data: FormGroup) {
    return new Promise((resolve, reject) => {
      if (data.valid){
        return this.openDatabase().then((res) =>{
          if(res){
            return this.database.executeSql('INSERT INTO users ( cedula, nombres, apellidos) VALUES(?,?,?)',
              [data.value.cedula,data.value.nombres,data.value.apellidos])
              .then(response => {
                console.log("Respuesta de insercion => "+response);
                resolve(true);
              })
              .catch(e => {
                console.log(e);
                reject(false);
              });
          }
        }).catch(e => {
          console.log(e);
          reject(false);
        });
      }
    });


  }

  actualizar(data: any, id: number){
    console.log(data);
    console.log(" ID usuario a actualizar ==>" + id);
    if(id > 1){
      return new Promise((resolve, reject) => {
        return this.openDatabase().then((res) =>{
          if(res){
            return this.database.executeSql(
              'UPDATE users SET cedula=?, nombres=?, apellidos=? WHERE id_user=?'
              ,[data.value.cedula,data.value.nombres,data.value.apellidos, id])
            .then(response =>{
              console.log("ACTUALIZAR PERFIL DE USUARIO");
              console.log(response['rowsAffected']);
              resolve(1);
            })
            .catch(e =>{
              console.log(e);
              reject(2);
            })
          }
        })
        .catch(e => {
          console.log(e);
          reject(2);
        });
      });
    }else{
      return 3;
    }

  }

}
