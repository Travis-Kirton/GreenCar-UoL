import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthService } from "./auth";
import { CommentMessage } from "../models/comment";
import { Observable } from "openlayers";

@Injectable()
export class MessagingService {

    constructor(private afDatabase: AngularFireDatabase,
                public authService: AuthService) { }


    messageRef: any;
    messageRef2: any;
    username = this.authService.getActiveUser().displayName;
    commentMessages: any;
    commentMessage: CommentMessage;
    uid = this.authService.getActiveUser().uid;

    sendMessage(msg: string, senderUID: string) {
        let number1:number = 0;
        let number2:number = 0;
        for(let i = 0; i < this.uid.length; i++){
            number1+=this.uid.charCodeAt(i);
        }
        for(let i = 0; i < senderUID.length; i++){
            number2+=senderUID.charCodeAt(i)
        }


        console.log(number1 + number2);
        this.messageRef = this.afDatabase.list<CommentMessage>('messages/' + (number1+number2));
        const timestamp = this.getTimeStamp();
        this.commentMessages = this.getMessages(senderUID);
        console.log(this.username);
        this.commentMessage = {
            uid: this.uid,
            message: msg,
            timeSent: timestamp,
            userName: this.username
        };
        return this.messageRef.push(this.commentMessage);
    }

    getTimeStamp(): string {
        const now = new Date();
        const date = now.getUTCFullYear() + '/' +
            (now.getUTCMonth() + 1) + '/' +
            now.getUTCDate();
        const time = now.getUTCHours() + ':' +
            now.getUTCMinutes() + ':' +
            now.getUTCMinutes();
        return (date + ' ' + time);
    }

    getMessages(contactUID: string) {
        let number1:number = 0;
        let number2:number = 0;
        for(let i = 0; i < this.uid.length; i++){
            number1+=this.uid.charCodeAt(i);
        }
        for(let i = 0; i < contactUID.length; i++){
            number2+=contactUID.charCodeAt(i)
        }
        // query to create comment feed binding
        return this.messageRef = this.afDatabase.list<CommentMessage>('messages/' + (number1+number2));
    }

}