import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {  IonicApp,
          IonicErrorHandler,
          IonicModule,
        AlertController } from 'ionic-angular';

import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegistroPage } from '../pages/registro/registro';
import { ReconexionPage } from '../pages/reconexion/reconexion';
import { NotificacionPage } from '../pages/notificacion/notificacion';
import { CortePage } from '../pages/corte/corte';
import { RecmanualPage } from '../pages/recmanual/recmanual';
import { PerfilPage } from '../pages/perfil/perfil';
import { ActividadPage } from '../pages/actividad/actividad';

import { PeticionhttpProvider } from '../providers/peticionhttp/peticionhttp';
import { DatabaseProvider } from '../providers/database/database';
import { UserProvider } from '../providers/user/user';
import { TareasProvider } from '../providers/tareas/tareas';

import { Camera, CameraOptions } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegistroPage,
    NotificacionPage,
    CortePage,
    ReconexionPage,
    RecmanualPage,
    PerfilPage,
    ActividadPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegistroPage,
    NotificacionPage,
    CortePage,
    ReconexionPage,
    RecmanualPage,
    PerfilPage,
    ActividadPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Toast,
    AlertController,
    PeticionhttpProvider,
    DatabaseProvider,
    UserProvider,
    TareasProvider,
    Camera

  ]
})
export class AppModule {}
