import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';

// COMPONENTS
import { MyApp } from './app.component';

// PAGES
import { HomePage } from '../pages/home/home';

// SERVICES
import { SqliteHelperService } from '../providers/sqlite-helper/sqlite-helper.service';
import { MovieService } from '../providers/movie/movie.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SqliteHelperService,
    MovieService
  ]
})
export class AppModule {}
