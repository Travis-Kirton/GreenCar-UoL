import firebase from 'firebase';

export class AuthService {
  private userToken: string;
  private uid: string;

  signup(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signin(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    firebase.auth().signOut();
  }

  getActiveUserUID(){
    console.log(firebase.auth().currentUser.uid);
    return firebase.auth().currentUser.uid;
  }

  getActiveUserToken() {
    return this.userToken;
  }

  setActiveUserToken(token: string){
    this.userToken = token;
  }

  getUID(): string{
    return this.uid;
  }
  setUID(uid: string){
    this.uid = uid;
  }
}
