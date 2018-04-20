 export class Route{
    constructor(public status: string,
                public disabled: boolean,
                public  dateBooked: number,
                public  startDate: string,
                public  pickUpTime: string,
                public  start:string,
                public  end: string,
                public  coords: number[][],
                public  username: string,
                public  repeating: boolean,
                public  daysOfWeek = {
                  Mon: false,
                  Tue: false,
                  Wed: false,
                  Thu: false,
                  Fri: false,
                  Sat: false,
                  Sun: false
                },
                public  description: string,
                public  comments: string[],
                public  luggageWeight?: number,
                public  seatsAvailable?: number,
                public  users?: any[],
                public  matchedRoute?: Route,
                public  suggestedRoutes?: Route[]){}

    
  public setStatus(status: string){
    this.status = status;
  }

  public getStatus(): string{
    return this.status;
  }


  public getStart(): string{
    return this.start;
  }

  public setStart(newStart: string){
    this.start = newStart;
  }

  public getEnd(): string{
    return this.end;
  }

  public setEnd(newEnd: string){
    this.end = newEnd;
  }

  public getCoords(): number[][]{
    return this.coords;
  }

  public setCoords(newCoords: number[][]){
    this.coords = newCoords;
  }

  public setUserName(username: string){
    this.username = username;
  }

  public getUserName(): string{
    return this.username;
  }

  public setRepeating(repeating: boolean){
    this.repeating = repeating;
  }

  public getRepeating(){
    return this.repeating;
  }

  public getstartDate(): string{
    return this.startDate
  }

  public getPickUpTime(): string{
    return this.pickUpTime;
  }

  public getdaysOfWeek(): object{
    return this.daysOfWeek;
  }

  public getLuggageWeight(): number{
    return this.luggageWeight;
  }

  public getSeatsAvailable(): number{
    return this.seatsAvailable;
  }

  public getDisabled(): boolean{
    return this.disabled;
  }

  public setDescription(desc){
    this.description = desc;
  }

  public getDescription(): string{
    return this.description;
  }

  public getComments(): string[]{
    return this.comments;
  }

  public setSuggestedRoutes(routes: Route[]){
    this.suggestedRoutes = routes;
  }

  public getSuggestedRoutes(){
    return this.suggestedRoutes;
  }

  public setMatchedRoute(route: Route){
    this.matchedRoute = route;
  }

  public getMatchedRoute(){
    return this.matchedRoute;
  }

  public setDateBooked(date: number){
    this.dateBooked = date;
  }

  public getDateBooked(): number{
    return this.dateBooked;
  }

  public addUsers(user){
    this.users.push(user);
  }


}
