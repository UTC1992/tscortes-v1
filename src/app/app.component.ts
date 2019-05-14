import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM, NotificationData } from '@ionic-native/fcm';
import { FIREBASE_CONFIG } from '../app/environment';
import { Firebase } from '@ionic-native/firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private fcm: FCM
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
      
      this.fcm.getToken().then((token : string) =>{
          console.log("Token para este celu ==>" + token);
        }
      ).catch(error =>{
        console.log(error);
      });

      this.fcm.onTokenRefresh().subscribe((token: string) =>{
        console.log("Actualziacion de token ==>" + token);
      });

      this.fcm.onNotification().subscribe(data =>{
        if(data.wasTapped){
          //ocurre cuando la app esta en segundo plano
          console.log("Estamos en segundo plano ==>" + JSON.stringify(data));
        } else {
          //ocurre cuando la app esta en primar plano 
          console.log("Estamos en primer plano ==>" + JSON.stringify(data));
        }
      }, error => {
        console.log(error);
      });

      

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
