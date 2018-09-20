export class Tarea {

  public id_tare: number;
  public id_temp: number;
  public n9cono: string;
  public  n9cocu: string;
  public n9cose: string;
  public n9coru: string;
  public n9plve: string;
  public n9vaca: string;
  public n9meco: string;
  public n9leco: string;
  public n9nomb: string;
  public n9refe: string;
  public n9cobs: string;
  public observacion: string;

  constructor(values: Object = [] ){
    Object.assign(this, values);
  }
}
