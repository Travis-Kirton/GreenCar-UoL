export class MapNode{
  constructor(public nodeId: number,
              public x: number,
              public y: number,
              public neighbours: MapNode[]){

  }
}
