import path from 'node:path'
import { read_file } from '../utils/file'

type Coordinate = {
  x: number,
  y: number,
}

class Rectangle {
  area: number;
  min_x: number;
  max_x: number;
  min_y: number;
  max_y: number;

  constructor(a: Coordinate, b: Coordinate) {
    this.min_x = a.x <= b.x ? a.x : b.x;
    this.max_x = a.x >= b.x ? a.x : b.x;
    this.min_y = a.y <= b.y ? a.y : b.y;
    this.max_y = a.y >= b.y ? a.y : b.y;
    this.area = (this.max_x - this.min_x + 1) * (this.max_y - this.min_y + 1);
  }

  // Is this point inside the rectangle
  contains(a: Coordinate): boolean {
    return (
      a.x > this.min_x && a.x < this.max_x
      && a.y > this.min_y && a.y < this.max_y
    );
  }

  // Do these two points form a line that crosses the rectangle
  // return true if we do not intersect
  does_not_intersect(a: Coordinate, b: Coordinate): boolean {
    // Horizontal line
    if (a.y === b.y) {
      return a.y <= this.min_y
        || a.y >= this.max_y
        || (a.x <= this.min_x && b.x <= this.min_x)
        || (a.x >= this.max_y && b.x >= this.max_x);
    }
    // Vertical line
    else {
      return a.x <= this.min_x
        || a.x >= this.max_x
        || (a.y <= this.min_y && b.y <= this.min_y)
        || (a.y >= this.max_y && b.y >= this.max_y)
    }
  }
}

async function run () {
  const filename = path.resolve(__dirname, './files/data.txt')
  const data = await read_file(filename);

  const coordinates = data.split('\n').map(line => {
    let [x, y] = line.split(',').map(Number);
    return { x: x!, y: y! }
  })

  part_one(coordinates);
  part_two(coordinates);
}

function part_one(coordinates: Coordinate[]) {
  let max_area = 0;

  for (let i = 0; i < coordinates.length; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      let corner_one = coordinates[i]!;
      let corner_two = coordinates[j]!;
      let height = Math.abs(corner_one.y - corner_two.y) + 1;
      let width = Math.abs(corner_one.x - corner_two.x) + 1;

      max_area = Math.max(max_area, height * width);
    }
  }

  console.log('The solution to part_one is:', max_area);
}

function part_two(coordinates: Coordinate[]) {
  let max_area = 0;
  let rectangles: Rectangle[] = [];

  // Create a list of possible rectangles
  for (let i = 0; i < coordinates.length; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      let a = coordinates[i]!;
      let b = coordinates[j]!;

      rectangles.push(new Rectangle(a, b));
    }
  }

  // Sort the rectangles based on area, then starting with the largest, look for
  // one that fits completely inside the bounds of the area
  rectangles.sort((a, b) => b.area - a.area);

  rectangles: for (let i = 0; i < rectangles.length; i++) {
    let rectangle = rectangles[i]!;
    // If any coordinate of the polygon is inside the rectangle, we have an
    // invalid rectangle and can't consider it's area
    let is_invalid = coordinates.some(coord => rectangle.contains(coord));
    if (is_invalid) continue;

    // If any set of points crosses the rectangle bounds, then we have an
    // invalid rectangle. Fail as soon as a point intersects
    let does_not_intersect = coordinates.every((coord, idx) => {
      let next_idx = idx === coordinates.length - 1 ? 0 : idx + 1;
      return rectangle.does_not_intersect(coord, coordinates[next_idx]!);
    });

    if (does_not_intersect) {
      max_area = rectangle.area;
      break rectangles;
    }
  }

  console.log('The solution to part_two is:', max_area);
}

run()
