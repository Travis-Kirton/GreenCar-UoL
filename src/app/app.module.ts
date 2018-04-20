import { MapService } from './../services/map';
import { Dijkstra } from './../services/dijkstra';
import { EdgeStorageService } from './../services/edgeStorage';
import { NodeStorageService } from './../services/nodeStorage';
import { Astar } from './../services/astar';
import { HttpModule } from '@angular/http';
import { RoutingService } from './../services/routing';
import { CreateJourneyPage } from './../pages/create-journey/create-journey';
import { PreferencesPage } from './../pages/preferences/preferences';
import { SignupPage } from './../pages/signup/signup';
import { SigninPage } from './../pages/signin/signin';
import { StatisticsPage } from './../pages/statistics/statistics';
import { AuthService } from './../services/auth';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularOpenlayersModule } from 'ngx-openlayers';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MessagesPage } from '../pages/messages/messages';
import { UserService } from '../services/user';
import { JourneyRetrievalService } from '../services/journeyRetrieval';
import { JourneyViewPage } from '../pages/journey-view/journey-view';
import { JourneyMatchingService } from '../services/journeyMatching';
import { JourneyJoiningService } from '../services/journeyJoining';
import { NotificationsService } from '../services/notifications';
import { MatchedJourneyPage } from '../pages/matched-journey/matched-journey';
import { PopoverHomePage } from '../pages/popover-home/popover-home';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SigninPage,
    SignupPage,
    PreferencesPage,
    StatisticsPage,
    CreateJourneyPage,
    JourneyViewPage,
    MessagesPage,
    MatchedJourneyPage,
    PopoverHomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist:false
    }),
    AngularOpenlayersModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SigninPage,
    SignupPage,
    PreferencesPage,
    StatisticsPage,
    CreateJourneyPage,
    JourneyViewPage,
    MessagesPage,
    MatchedJourneyPage,
    PopoverHomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    UserService,
    SignupPage,
    RoutingService,
    NodeStorageService,
    EdgeStorageService,
    MapService,
    RoutingService,
    Astar,
    Dijkstra,
    JourneyRetrievalService,
    JourneyMatchingService,
    JourneyJoiningService,
    NotificationsService
  ]
})
export class AppModule {}
