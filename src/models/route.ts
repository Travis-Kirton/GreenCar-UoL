export class Route{

    constructor(public status: string,
                public disabled: boolean,
                private dateBooked: number,
                private startDate: number,
                private pickUpTime: number,
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
                private comment: string,
                private luggageWeight?: number,
                private seatsAvailable?: number){}



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

  getstartDate(): number{
    return this.startDate
  }

  getPickUpTime(): number{
    return this.pickUpTime;
  }

  getdaysOfWeek(): object{
    return this.daysOfWeek;
  }

  getLuggageWeight(): number{
    return this.luggageWeight;
  }

  getStatus(): string{
    return this.status;
  }

  getDisabled(): boolean{
    return this.disabled;
  }

  setComment(comment){
    this.comment = comment;
  }

  getComment(): string{
    return this.comment;
  }


}
