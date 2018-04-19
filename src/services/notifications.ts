import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Http, Response } from "@angular/http";

@Injectable()
export class NotificationsService {

    constructor(private authService: AuthService,
        private http: Http) { }

    notifications: object[] = []

    pushNotificationToUser(token, uid, timestamp, request) {
        console.log("pushing to: " + uid);

        const userId = this.authService.getActiveUser().uid;
        this.notifications.push({user: userId, journeyDate: timestamp, request: request, seen: false});
        return this.http.put('https://greencar-uol.firebaseio.com/' + uid + '/notifications.json?auth=' + token, this.notifications)
            .map((response: Response) => {
                return response.json();
            });
    }

    fetchNotifications(token) {
        const userId = this.authService.getActiveUser().uid;
        return this.http.get('https://greencar-uol.firebaseio.com/' + userId + '/notifications.json?auth=' + token)
            .map((response: Response) => {
                return response.json();
            })
            .do((notifications: Notification[]) => {
                if (notifications) {
                    this.notifications = notifications;
                } else {
                    this.notifications = [];
                }
            });
    }

    setNotifications(notifications: object[]){
        this.notifications = notifications;
    }

    getNotifications(): object[]{
        return this.notifications;
    }



}