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
import { AuthService } from './../services/auth';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularOpenlayersModule } from 'ngx-openlayers';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserService } from '../services/user';
import { JourneyRetrievalService } from '../services/journeyRetrieval';
import { JourneyViewPage } from '../pages/journey-view/journey-view';
import { JourneyMatchingService } from '../services/journeyMatching';
import { NotificationsService } from '../services/notifications';
import { MatchedJourneyPage } from '../pages/matched-journey/matched-journey';
import { PopoverHomePage } from '../pages/popover-home/popover-home';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { CommentService } from '../services/commentService';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { MessagingService } from '../services/messaging';
import { ChatPage } from '../pages/chat/chat';
import { Camera } from '@ionic-native/camera';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,
    SigninPage,
    SignupPage,
    PreferencesPage,
    CreateJourneyPage,
    JourneyViewPage,
    MatchedJourneyPage,
    PopoverHomePage,
    ChatPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist:false
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularOpenlayersModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,
    SigninPage,
    SignupPage,
    PreferencesPage,
    CreateJourneyPage,
    JourneyViewPage,
    MatchedJourneyPage,
    PopoverHomePage,
    ChatPage
    ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    AngularFireAuth,
    UserService,
    SignupPage,
    RoutingService,
    NodeStorageService,
    EdgeStorageService,
    MapService,
    RoutingService,
    Astar,
    Dijkstra,
    Camera,
    JourneyRetrievalService,
    JourneyMatchingService,
    NotificationsService,
    CommentService,
    MessagingService,
    AngularFireDatabaseModule,
  ]
})
export class AppModule {}
