import path from 'node:path';
import { read_file } from '../utils/file';
import { DisjointUnionSet } from './disjoint';

// type Connection = {
//   distance: number,
//   src: Point,
//   dest: Point
// }

// type ConnectionMap = { [key: number]: Connection };

class Point {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  //
  // toString(): string {
  //   return `${this.x}-${this.y}-${this.z}`;
  // }
}

async function run() {
  const filepath = path.resolve(__dirname, './files/sample.txt');
  const data = await read_file(filepath);

  const points: Point[] = data.split('\n').map(row => {
    const [x, y, z] = row.split(',').map(Number);
    return new Point(x!, y!, z!);
  });

  part_one(points);
  part_two(points);
}

function part_one(points: Point[]) {
  let connections = get_connections(points);
  connections.sort((a, b) => a[0]! - b[0]!)
  let disjoint_set = new DisjointUnionSet(points.length);
  // Only make 10 connections on the sample data, and 1000 on the actual data
  let connections_to_make = points.length === 20 ? 10 : 1000;

  for (let i = 0; i < connections_to_make; i++) {
    let [_, src, dest] = connections[i]!;
    if (src === undefined || dest === undefined) continue;

    disjoint_set.union(src, dest);
    // console.log(src, dest);
    // console.log(disjoint_set.parent)
    // console.log(disjoint_set.size)
  }

  const sizes = disjoint_set.size.sort((a, b) => b - a);
  const result = sizes[0]! * sizes[1]! * sizes[2]!;

  console.log('The solution to part_one is:', result);

  // Old Solution, This works, but I struggled to adapt it correctly for the
  // second use case by determining the correct exit condition in the loop
  // so I changed the first problem to use a disjointed set as well
  // // Get our connections
  // let connections = Object.values(get_connection_map(points));
  // connections.sort((a, b) => a.distance - b.distance);
  //
  // // 10 for the sample input, 1000 for the real input
  // let num_connections = points.length === 20 ? 10 : 1000;
  //
  // // Start combining the points into circuits
  // const circuits = points.map(value => [String(value)]);
  //
  // for (let i = 0; i < num_connections; i++) {
  //   let connection = connections.shift()!;
  //   let src_index = circuits.findIndex(point => point.indexOf(String(connection.src)) > -1);
  //   let dest_index = circuits.findIndex(point => point.indexOf(String(connection.dest)) > -1);
  //
  //   if (src_index !== dest_index) {
  //     circuits[src_index] = circuits[src_index]!.concat(circuits[dest_index]!);
  //     circuits.splice(dest_index, 1);
  //   }
  // }
  //
  // // Get the product of the three largest circuits
  // let result = circuits
  //   .map(circuit => circuit.length)
  //   .sort((a, b) => b - a)
  //   .slice(0, 3)
  //   .reduce((acc, curr) => acc * curr, 1);
  //
  // console.log('The solution to part_one is:', result);
}

function part_two(points: Point[]) {
  let connections = get_connections(points);
  connections.sort((a, b) => a[0]! - b[0]!)
  let disjoint_set = new DisjointUnionSet(points.length);
  let result;

  for (let i = 0; i < connections.length; i++) {
    let [_, src, dest] = connections[i]!;
    if (src === undefined || dest === undefined) continue;

    disjoint_set.union(src, dest);

    if (disjoint_set.max === points.length) {
      result = points[src]!.x * points[dest]!.x;
      break;
    }
  }

  console.log('The solution to part_two is:', result);
}

function euclidean_distance(src: Point, dest: Point): number {
  return Math.sqrt(
    Math.pow(dest.x - src.x, 2)
    + Math.pow(dest.y - src.y, 2)
    + Math.pow(dest.z - src.z, 2)
  )
}

function get_connections(points: Point[]): number[][] {
  let connections = [];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let distance = euclidean_distance(points[i]!, points[j]!);
      connections.push([distance, i, j]);
    }
  }

  return connections;
}

// function get_connection_map(points: Point[]): ConnectionMap {
//   let connection_map: ConnectionMap = {};
//
//   for (let i = 0; i < points.length; i++) {
//     for (let j = 0; j < points.length; j++) {
//       // Dont calculate distance to self
//       if (i === j) continue;
//
//       // Calculate the distance to this point
//       const src = points[i]!;
//       const dest = points[j]!;
//       const distance = euclidean_distance(src, dest);
//       connection_map[distance] = {
//         distance,
//         src,
//         dest
//       };
//     }
//   }
//
//   return connection_map;
// }

run();
