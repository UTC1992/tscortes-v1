import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReconexionPage } from './reconexion';

@NgModule({
  declarations: [
    ReconexionPage,
  ],
  imports: [
    IonicPageModule.forChild(ReconexionPage),
  ],
  exports: [
    ReconexionPage,
  ]
})
export class ReconexionPageModule {}
