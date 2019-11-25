import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { FCM, NotificationData } from '@ionic-native/fcm';

import { LocalNotifications } from '@ionic-native/local-notifications';

// Implementamos la librería de notificaciones Push.
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public localNotification: LocalNotifications,
              private push: Push,
              ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: 'HomePage', icon: 'ios-home' },
      { title: 'Notificaciones', component: 'NotificacionPage', icon: 'ios-list-box'  },
      { title: 'Cortes', component: 'CortePage', icon: 'ios-list-box'  },
      { title: 'Reconexiones', component: 'ReconexionPage', icon: 'ios-list-box'  },
      { title: 'Reconexiones manuales', component: 'RecmanualPage', icon: 'ios-list-box'  },
      { title: 'Retiro de medidores', component: 'RetiromedidorPage', icon: 'ios-list-box'  },
      { title: 'Limpiar datos', component: 'BorrardatosPage', icon: 'ios-trash'  },
      { title: 'Perfil', component: 'PerfilPage', icon: 'ios-contact'  }

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //this.mostrarNotificacionFCM();
      this.mostrarNotificacionPush();
    });
  }

  mostrarNotificacionFCM(){
    /*
    this.fcm.getToken().then(
      (token: string) => {
        console.log("Token de dispositivo : ");
        console.log(token);
      }
    ).catch(error => {
      console.log(error);
    });

    this.fcm.onTokenRefresh().subscribe((token: string) => {
      console.log("Actualizacion de Token de dispositivo : " + token);
    });

    this.fcm.onNotification().subscribe(dataApi => {
      if(dataApi.wasTapped){
        //ocurre cuando la app esta en segundo plano
        console.log("esta en segundo plano : ");
        console.log(dataApi);
      } else {
        //ocurre cuando la app esta en primer plano
        console.log("esta en primer plano : ");
        console.log(dataApi);

        this.localNotification.schedule({
          id: (Math.floor(Math.random() * 100) + 1),
          title: dataApi.title,
          text: dataApi.body,
          data: {
            nombre: dataApi.nombre,
            apellido: dataApi.apellido
          }
        });

      }
    }, error => {
      console.log("Error : " + error);
    });

    this.localNotification.on('click').subscribe(resultado => {
      console.log("resultado al clic");
      console.log(resultado);
      this.nav.setRoot("NotificacionPage");
    });
    */
  }

  mostrarNotificacionPush(){
    // to check if we have permission
    this.push.hasPermission()
    .then((res: any) => {

      if (res.isEnabled) {
        console.log('We have permission to send push notifications');
      } else {
        console.log('We do not have permission to send push notifications');
      }

    });

    const options: PushOptions = {
       android: {
            // Añadimos el sender ID para Android.
            senderID: '478671882943',
            sound: 'true',
            vibrate: true,
            forceShow: "1",
            
       },
       ios: {
           alert: 'true',
           badge: true,
           sound: 'false'
       },
    };
 
    const pushObject: PushObject = this.push.init(options);
 
    pushObject.on('notification').subscribe((notification: any) => {
        console.log('Received a notification', notification);
        this.localNotification.schedule({
          id: (Math.floor(Math.random() * 100) + 1),
          title: notification.title,
          text: notification.message,
          foreground: true,
          summary: 'Hay% n% notificaciones',
          vibrate: true,
          data: {
            nombre: notification.additionalData.nombre,
          }
        });
        
      });
      
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration)
    });
    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error)
    });

    this.localNotification.on('click').subscribe(resultado => {
      console.log("resultado al clic");
      console.log(resultado);
      this.nav.setRoot("HomePage");
    });

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
