import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Http, Response } from "@angular/http";

@Injectable()
export class NotificationsService {

    constructor(private authService: AuthService,
        private http: Http) { }

    notifications: any[] = [];

    pushNotificationToUser(userID, datestamp, request, uid, token) {
        let notification = { username: this.authService.getUsername(),userID: userID, journeyDate: datestamp, request: request };
        return this.http.put('https://greencar-uol.firebaseio.com/' + uid + '/notification/' + (userID + '-'+ datestamp) + '.json?auth=' + token, notification)
            .map((response: Response) => {
                return response.json();
            });
    }

    fetchNotifications(token, uid) {
        const userId = this.authService.getActiveUser().uid;
        return this.http.get('https://greencar-uol.firebaseio.com/' + uid + '/notification.json?auth=' + token)
            .map((response: Response) => {
                return response.json();
            })
            .do((notifications: any[]) => {
                if (notifications) {
                    this.notifications = notifications;
                } else {
                    this.notifications = [];
                }
            });
    }

    setNotifications(notifications: Notification[]) {
        this.notifications = notifications;
    }

    getNotifications(): any[] {
        return this.notifications;
    }



}