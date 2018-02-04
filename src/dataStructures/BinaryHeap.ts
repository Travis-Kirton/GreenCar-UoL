export class BinaryHeap{
  content: any[];
  scoreFunction: (node: any) => number;

  constructor(scoreFunction:(node:any) => number) {
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  push(element: any) {
    this.content.push(element);
    this.bubbleUp(this.content.length - 1);
  }

  pop(): any {
    let result = this.content[0];
    let end = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  }

  remove(node: any) {
    let length = this.content.length;
    for (var i = 0; i < length; i++) {
      if (this.content[i] != node) continue;
      let end = this.content.pop();
      if (i == length - 1) break;
      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  }

  size() {
    return this.content.length;
  }



  private bubbleUp(n: number) {
    // Fetch element to be moved
    let element = this.content[n], score = this.scoreFunction(element);

    while (n > 0) {
      // Compute the parents element's index, and fetch it
      let parentN = Math.floor((n + 1) / 2) - 1, parent = this.content[parentN];
      // If the parent has a lesser score, things are in order
      if (score >= this.scoreFunction(parent)) break;
      // Otherwise swap parent with current element
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  }


  private sinkDown(n: number) {
    // Look up target element and its score
    var length = this.content.length,
      element = this.content[n],
      elemScore = this.scoreFunction(element);

    while (true) {
      // Compute indices of child elements
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      var swap = null;
      if (child1N < length) {
        var child1 = this.content[child1N],
          child1Score = this.scoreFunction(child1);

        if (child1Score < elemScore)
          swap = child1N;
      }

      if (child2N < length) {
        var child2 = this.content[child2N],
          child2Score = this.scoreFunction(child2);

        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      if(swap == null) break;

      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
}
