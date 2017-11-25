export class MapNode{
  constructor(public nodeId: number,
              public x: number,
              public y: number,
              public neighbours: MapNode[]){}

  f: number;
  g: number; // g = cost to this node
  h: number; // h = cost from this node to goal

  // Accessors/Mutators for heuristic value (f,g,h)
  setF(newF: number){
    this.f = newF;
  }

  getF(): number{
    return this.f;
  }

  setG(newG: number){
    this.g= newG;
  }

  getG(): number{
    return this.g;
  }

  setH(newH: number){
    this.h = newH;
  }

  getH(): number{
    return this.h;
  }
}
