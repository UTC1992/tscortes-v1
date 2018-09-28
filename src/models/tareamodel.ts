export class TareaModel {

  public id_tare: number;
  public id_act: number;
  public n9cono: string;
  public n9cocu: string;
  public n9cose: string;
  public n9coru: string;
  public n9plve: string;
  public n9vaca: string;
  public n9meco: string;
  public n9leco: string;
  public n9cocl: string;
  public n9nomb: string;
  public n9refe: string;
  public cusecu: string;
  public cucoon: string;
  public cucooe: string;
  public foto: string;
  public rutaimg: string;
  public observacion: string;
  public fecha: string;
  public hora: string;
  public estado: string;
  public cedula_emp: string;
  public id_tecn: string;

  constructor(id_tare: number,id_act: number, n9cono: string,
              n9cocu: string, n9cose: string, n9coru: string,
              n9plve: string, n9vaca: string, n9meco: string,
              n9leco: string, n9cocl: string, n9nomb: string,
              n9refe: string, cusecu: string, cucoon: string,
              cucooe: string, foto: string, rutaimg: string,
              observacion: string, fecha: string, hora: string,
              estado: string, cedula_emp: string,id_tecn: string
              ){
  this.id_tare = id_tare;
  this.id_act = id_act;
  this.n9cono =  n9cono;
  this.n9cocu = n9cocu;
  this.n9cose = n9cose;
  this.n9coru = n9coru;
  this.n9plve = n9plve;
  this.n9vaca = n9vaca;
  this.n9meco = n9meco;
  this.n9leco = n9leco;
  this.n9cocl = n9cocl;
  this.n9nomb = n9nomb;
  this.n9refe = n9refe;
  this.cusecu = cusecu;
  this.cucoon = cucoon;
  this.cucooe = cucooe;
  this.foto = foto;
  this.rutaimg = rutaimg;
  this.observacion = observacion;
  this.fecha = fecha;
  this.hora = hora;
  this.estado = estado;
  this.cedula_emp = cedula_emp;
  this.id_tecn = id_tecn;
  }


}
