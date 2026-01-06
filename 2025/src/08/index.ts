import path from 'node:path';
import { read_file } from '../utils/file';

class Point {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

async function run() {
  const filepath = path.resolve(__dirname, './files/sample.txt');
  const data = await read_file(filepath);

  const points: Point[] = data.split('\n').map(row => {
    const [x, y, z] = row.split(',').map(Number);
    return new Point(x!, y! , z!);
  });

  part_one(points);
  part_two(points);
}

function euclidean_distance(src: Point, dest: Point): number {
  return Math.sqrt(
    Math.pow(dest.x - src.x, 2)
    + Math.pow(dest.y - src.y, 2)
    + Math.pow(dest.z - src.z, 2)
  )
}

function part_one(points: Point[]) {

}

function part_two(points: Point[]) {

}

run();
