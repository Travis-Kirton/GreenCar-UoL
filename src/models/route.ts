export class Route{

    constructor(private dateBooked: number,
                private matchedWithDriver: boolean,
                private start:string,
                private end: string,
                private coords: number[][],
                private username: string){}



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


}
