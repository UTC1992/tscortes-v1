import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecmanualeditPage } from './recmanualedit';

@NgModule({
  declarations: [
    RecmanualeditPage,
  ],
  imports: [
    IonicPageModule.forChild(RecmanualeditPage),
  ],
  exports: [
    RecmanualeditPage,
  ]
})
export class RecmanualeditPageModule {}
