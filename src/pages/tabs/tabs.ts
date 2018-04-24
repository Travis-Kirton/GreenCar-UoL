import { MessagesPage } from './../messages/messages';
import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { AlertController } from 'ionic-angular';
import { NotificationsService } from '../../services/notifications';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationMessage } from '../../models/notification';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  //tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = MessagesPage;

  userRole: any;

  private tab1BadgeCount$: Observable<NotificationMessage[]>;
  private tab1BadgeCount: number = 0;
  //private uid = this.authService.getActiveUser().uid;

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private notificationService: NotificationsService,
    private afDatabase: AngularFireDatabase) {

        this.tab1BadgeCount$ = this.notificationService
          .getNotifications() // DB List
          .snapshotChanges() // Key:Value pairs
          .map(changes => {
            return changes.map(c => ({
              key: c.payload.key,
              ...c.payload.val()
            }));
          });

        this.tab1BadgeCount$.forEach(notifications => {
          notifications.forEach(notification => {
            console.log(notification.seen);
            if (notification.seen == false) {
              this.tab1BadgeCount++;
            }
          })
        });
     



    this.setUserType();

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

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
