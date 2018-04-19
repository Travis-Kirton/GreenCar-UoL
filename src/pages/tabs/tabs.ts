import { MessagesPage } from './../messages/messages';
import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { AlertController } from 'ionic-angular';
import { NotificationsService } from '../../services/notifications';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = MessagesPage;

  userRole: any;

  tab1BadgeCount: number;

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private notificationService: NotificationsService) {

    this.setUserType();

  }

  ionViewDidLoad(){
    this.loadNotifications();
  }

  setUserType() {
    this.authService.getActiveUser().getIdToken()
      .then(
        (token: string) => {
          this.userService.fetchRoles(token)
            .subscribe(
              (roles) => {
                if (roles) {
                  this.userRole = roles;
                  this.userService.setUserRole(this.userRole);
                }
              },
              error => {
                this.handleError(error.json().error);
              }
            );
        });
  }

  private loadNotifications(){
    this.authService.getActiveUser().getIdToken()
      .then((token: string) => {
        let uid = this.authService.getActiveUser().uid;
        this.notificationService.fetchNotifications(token, uid)
          .subscribe((notifications: object[]) => {
            if(notifications){
              let ArrNotifications = notifications = Object.keys(notifications).map(key => {
                return notifications[key];
            });
              this.tab1BadgeCount = ArrNotifications.length;
              this.notificationService.setNotifications(ArrNotifications);
            }else{
              console.log(notifications);
            }
          },
          error => {
            this.handleError(error.json().error);
          });
      });
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
