export class Route{

    constructor(public status: string,
                public disabled: boolean,
                private dateBooked: number,
                private startDate: string,
                private pickUpTime: string,
                private start:string,
                private end: string,
                private coords: number[][],
                private username: string,
                private repeating: boolean,
                private daysOfWeek = {
                  Mon: false,
                  Tue: false,
                  Wed: false,
                  Thu: false,
                  Fri: false,
                  Sat: false,
                  Sun: false
                },
                private description: string,
                private comments: string[],
                private luggageWeight?: number,
                private seatsAvailable?: number,
                private users?: string[],
                private matchedRoute?: Route,
                private suggestedRoutes?: Route[]){}

    
  setStatus(status: string){
    this.status = status;
  }

  getStatus(): string{
    return this.status;
  }


  getStart(): string{
    return this.start;
  }

  setStart(newStart: string){
    this.start = newStart;
  }

  getEnd(): string{
    return this.end;
  }

  setEnd(newEnd: string){
    this.end = newEnd;
  }

  getCoords(): number[][]{
    return this.coords;
  }

  setCoords(newCoords: number[][]){
    this.coords = newCoords;
  }

  setUserName(username: string){
    this.username = username;
  }

  getUserName(): string{
    return this.username;
  }

  getstartDate(): string{
    return this.startDate
  }

  getPickUpTime(): string{
    return this.pickUpTime;
  }

  getdaysOfWeek(): object{
    return this.daysOfWeek;
  }

  getLuggageWeight(): number{
    return this.luggageWeight;
  }

  getDisabled(): boolean{
    return this.disabled;
  }

  setDescription(desc){
    this.description = desc;
  }

  getDescription(): string{
    return this.description;
  }

  getComments(): string[]{
    return this.comments;
  }

  setSuggestedRoutes(routes: Route[]){
    this.suggestedRoutes = routes;
  }

  getSuggestedRoutes(){
    return this.suggestedRoutes;
  }

  setMatchedRoute(route: Route){
    this.matchedRoute = route;
  }

  getMatchedRoute(){
    return this.matchedRoute;
  }


}
