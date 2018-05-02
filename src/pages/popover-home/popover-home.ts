import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { UserService } from '../../services/user';
import { RoutingService } from '../../services/routing';
import { AuthService } from '../../services/auth';
import { Route } from '../../models/route';

/**
 * Generated class for the PopoverHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-popover-home',
  templateUrl: 'popover-home.html',
})
export class PopoverHomePage {

  user: any;
  userRole: any;
  uid: string;
  journey: Route;
  routeKey: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public routingService: RoutingService,
              public userService: UserService,
              public authService: AuthService) {
    this.user = this.navParams.get('user');
    this.routeKey = this.navParams.get('routeKey');
    this.journey = this.navParams.get('journey');
    

    this.uid = this.authService.getActiveUser().uid;
    this.userRole = this.userService.getUserRole();
  }

  messageUser(){
    this.navCtrl.push(ChatPage, {user: this.user});
  }

  removeUser(){
    console.log(this.user);
    this.user.journey.status = 'unmatched';
    this.user.journey.suggestedRoutes.splice(0, this.user.journey.suggestedRoutes.length);
    this.routingService.removeUser(this.journey, this.navParams.get('index'));
    this.routingService.updateUserJourney(this.user.userID, this.user.journey.key, this.user.journey);
    this.navCtrl.pop();
  }
}
