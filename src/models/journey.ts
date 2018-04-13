export class Journey {


    constructor(public uid: string,
        public start: number[],
        public end: number[],
        public timestamp: number,
        public username: string) {
    }
}