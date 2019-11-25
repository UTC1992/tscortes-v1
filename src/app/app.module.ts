import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {  IonicApp,
          IonicErrorHandler,
          IonicModule,
        AlertController,
      IonicPage } from 'ionic-angular';

import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';

import { PeticionhttpProvider } from '../providers/peticionhttp/peticionhttp';
import { UserProvider } from '../providers/user/user';
import { TareasProvider } from '../providers/tareas/tareas';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { RecmanualProvider } from '../providers/recmanual/recmanual';

//import { FCM } from '@ionic-native/fcm';

import { LocalNotifications } from '@ionic-native/local-notifications';

// Implementamos la librería de notificaciones Push.
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { MensajeFcmProvider } from '../providers/mensaje-fcm/mensaje-fcm';

@IonicPage()
@NgModule({
  declarations: [
    MyApp,
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
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Toast,
    AlertController,
    PeticionhttpProvider,
    UserProvider,
    TareasProvider,
    Camera,
    File,
    RecmanualProvider,
    MensajeFcmProvider,

  ]
})
export class AppModule {}
