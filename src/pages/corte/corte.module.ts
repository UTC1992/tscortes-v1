import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CortePage } from './corte';

@NgModule({
  declarations: [
    CortePage,
  ],
  imports: [
    IonicPageModule.forChild(CortePage),
  ],
})
export class CortePageModule {}
