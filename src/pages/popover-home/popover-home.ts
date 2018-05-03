import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { UserService } from '../../services/user';
import { RoutingService } from '../../services/routing';
import { AuthService } from '../../services/auth';
import { Route } from '../../models/route';

/**
 * Author: Travis Kirton
 * Desription: PopoverHomePage Component
 * Date: 03/05/2018
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
    
    // fetch details passed in when page pushed
    this.user = this.navParams.get('user');
    this.routeKey = this.navParams.get('routeKey');
    this.journey = this.navParams.get('journey');
    
    // get current user details
    this.uid = this.authService.getActiveUser().uid;
    this.userRole = this.userService.getUserRole();
  }

  // Push Chat Page and pass specific user for messaging
  messageUser(){
    this.navCtrl.push(ChatPage, {user: this.user});
  }


  // remove user from Journey (driver only)
  removeUser(){
    this.user.journey.status = 'unmatched';
    this.user.journey.suggestedRoutes.splice(0, this.user.journey.suggestedRoutes.length);
    this.routingService.removeUser(this.journey, this.navParams.get('index'));
    this.routingService.updateUserJourney(this.user.userID, this.user.journey.key, this.user.journey);
    this.navCtrl.pop();
  }
}
