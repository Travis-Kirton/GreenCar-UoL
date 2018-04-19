import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NotificationsService } from '../../services/notifications';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  notifications: object[] = [];

  constructor(public navCtrl: NavController,
              public notifService: NotificationsService) {

  }

  ionViewDidLoad(){
    this.notifications = this.notifService.getNotifications();
  }

}
