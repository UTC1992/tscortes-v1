import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecnuevaPage } from './recnueva';

@NgModule({
  declarations: [
    RecnuevaPage,
  ],
  imports: [
    IonicPageModule.forChild(RecnuevaPage),
  ],
  exports: [
    RecnuevaPage
  ]
})
export class RecnuevaPageModule {}
