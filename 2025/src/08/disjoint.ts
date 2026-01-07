export class DisjointUnionSet {

  max: number;
  parent: number[];
  size: number[];

  constructor(size: number) {
    this.max = 0;
    // Initially, each element is in its own set, we are going to store indices
    // of elements in here, so this is a simple way to make them their own
    // parent
    this.parent = Array.from({ length: size }, (_, idx) => idx);
    this.size = new Array(size).fill(1);
  }

  find(i: number): number {
    return this.parent[i] === i ? i : this.find(this.parent[i]!);
  }

  union(src: number, dest: number) {
    let a = this.find(src);
    let b = this.find(dest);

    if (a === b) return;

    // Something went wrong here
    if (this.size[a] === undefined || this.size[b] === undefined) return;

    if (this.size[a] < this.size[b]) {
      this.parent[a] = b;
      this.size[b] += this.size[a];
      this.max = Math.max(this.max, this.size[b]);
    } else {
      this.parent[b] = a;
      this.size[a] += this.size[b];
      this.max = Math.max(this.max, this.size[a])
    }
  }

}
