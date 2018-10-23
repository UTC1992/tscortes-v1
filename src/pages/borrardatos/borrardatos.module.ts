import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BorrardatosPage } from './borrardatos';

@NgModule({
  declarations: [
    BorrardatosPage,
  ],
  imports: [
    IonicPageModule.forChild(BorrardatosPage),
  ],
  exports: [
    BorrardatosPage,
  ]
})
export class BorrardatosPageModule {}
