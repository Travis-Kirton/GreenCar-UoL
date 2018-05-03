import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { AlertController, NavController } from 'ionic-angular';
import { NotificationsService } from '../../services/notifications';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationMessage } from '../../models/notification';
import { Observable } from 'rxjs/Observable';
import firebase  from 'firebase';

/**
 * Author: Travis Kirton
 * Desription: TabsPage Component
 * Date: 03/05/2018
 */

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // Set Tab Pages
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  userRole: any;

  private notifSub: any;
  private tab1BadgeCount: number = 0;

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private nav: NavController,
    private notificationService: NotificationsService,
    private afDatabase: AngularFireDatabase) {
    this.setUserType();
    this.getNotifications();
  }

  // Set User Type by fetching from UserService
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

  // Handle Any Error Messages and display to user
  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

  // Get Notifications and set Tab badge count to length of notifications
  getNotifications() {
    this.notifSub = this.notificationService
      .getNotifications().snapshotChanges().subscribe(data => {
        this.tab1BadgeCount = data.length;
      });
  }

  // On page leave - unsubscribe from observable
  ngOnDestroy() {
    this.notifSub.unsubscribe();
  }
}
