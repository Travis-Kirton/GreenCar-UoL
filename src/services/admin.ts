import { Injectable } from "@angular/core";
import * as admin from 'firebase-admin';

@Injectable()
export class AdminService{

    listAllUsers(nextPageToken){
        admin.auth().listUsers()
        .then(listResult => {
            listResult.users.forEach(userRecord => {
                console.log("user: ", userRecord);
            });
            if(listResult.pageToken){
                this.listAllUsers(listResult.pageToken);
            }
        })
        .catch(err => {
            console.log("Error listing users: ", err);
        });
    }

    deleteUser(uid){
        admin.auth().deleteUser(uid).then(res => {
            console.log("User successfully Deleted");
        })
        .catch(err => {
            console.log("An Error Occurred: ", err)
        })
    }

    createAdmin(email, password, displayName){
        admin.auth().createUser({
            email: email,
            password: password,
            displayName: displayName,
            disabled: false
        })
        .then(userRecord => {
            console.log("Created User: ", userRecord.uid);
        })
        .catch(err => {
            console.log("Error Creating User: ", err);
        })
    }

    disableUser(uid){

    }

}