import { Component } from '@angular/core';
import { NotificationsService } from '../../services/notifications';
import { NotificationMessage } from '../../models/notification';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  notifications: Observable<NotificationMessage[]>;

  constructor(public notifService: NotificationsService) {
    this.notifications = this.notifService
      .getNotifications()
      .snapshotChanges() // Key:Value pairs
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      });
  }

  removeNotification(key){
    this.notifService.removeNotification(key);
  }

}
