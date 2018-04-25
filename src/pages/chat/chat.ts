import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { CommentMessage } from '../../models/comment';
import { MessagingService } from '../../services/messaging';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  uid =  this.authService.getActiveUser().uid;
  user: any = this.navParams.get('user');
  messageText: string
  private messageList$: Observable<CommentMessage[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService,
              public messageService: MessagingService) {
    this.messageList$ = this.messageService
              .getMessages(this.user.userID) // DB List
              .snapshotChanges() // Key:Value pairs
              .map(changes => {
                return changes.map(c => ({
                  key: c.payload.key,
                  ...c.payload.val()
                }));
              });
  }


  sendMessage(){
    this.messageService.sendMessage(this.messageText, this.user.userID).then(ref => {
    });
    this.messageText = ' ';
  }


}
