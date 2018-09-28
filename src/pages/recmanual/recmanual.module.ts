import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecmanualPage } from './recmanual';

@NgModule({
  declarations: [
    RecmanualPage,
  ],
  imports: [
    IonicPageModule.forChild(RecmanualPage),
  ],
  exports: [
    RecmanualPage,
  ]
})
export class RecmanualPageModule {}
