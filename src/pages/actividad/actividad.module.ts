import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActividadPage } from './actividad';

@NgModule({
  declarations: [
    ActividadPage,
  ],
  imports: [
    IonicPageModule.forChild(ActividadPage),
  ],
  exports: [
    ActividadPage,
  ]
})
export class ActividadPageModule {}
