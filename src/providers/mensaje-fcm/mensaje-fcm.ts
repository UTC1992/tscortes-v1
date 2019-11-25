import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Url } from '../../models/Url'

import { LocalNotifications } from '@ionic-native/local-notifications';

// Implementamos la librería de notificaciones Push.
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { PeticionhttpProvider } from '../../providers/peticionhttp/peticionhttp';

@Injectable()
export class MensajeFcmProvider {
    urlBase: Url = new Url();
    url = this.urlBase.baseMovil;

    objetoPush: any;

    constructor(
            public http: HttpClient,
            public localNotification: LocalNotifications,
            private push: Push,
            private peticionHttp: PeticionhttpProvider,
    ) {
        const options: PushOptions = {
            android: {
                // Añadimos el sender ID para Android.
                senderID: '478671882943'
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
         };
        
        const pushObject: PushObject = this.push.init(options);

        pushObject.on('registration').subscribe((registration: any) => {
          console.log('Device registered', registration);
        });

        pushObject.on('error').subscribe(error => {
          console.error('Error with Push plugin', error);
        });

        pushObject.on('notification').subscribe((notification: any) => {
          console.log('Received a notification', notification);
          this.localNotification.schedule({
              id: (Math.floor(Math.random() * 100) + 1),
              title: notification.title,
              text: notification.message,
              data: {
              nombre: notification.additionalData.nombre,
              }
          });
      
      });
  
      this.localNotification.on('click').subscribe(resultado => {
          console.log("resultado al clic");
          console.log(resultado);
      //this.nav.setRoot("NotificacionPage");
      });
        
    }



  getTokenFcm(cedula){
    
    
    
  }

  recibirMensaje(){
    
  }
  

}
