import { read_file } from '../utils/file';
import { resolve } from 'node:path'

async function run () {
  const filepath = resolve(__dirname, './files/data.txt');
  const file = await read_file(filepath);

  part_one(file);
}

type Region = {
  area: number,
  presents: number[]
}

function part_one(file: string) {
  let solution = 0;

  // try the stupid approach, count the number of spaces necessary per shape
  // and see if they fit inside the regions based purely on available area
  const lines = file.split('\n');
  const package_declaration = /^\d:/;
  const region_declaration = /^\d+x\d+:/;
  const packages: number[] = [];
  const regions: Region[] = [];

  // Create arrays of packages and regions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    if (package_declaration.test(line)) {
      const index = parseInt(line);
      // Combine the string, we're just counting x's present in all three lines
      // make sure to advance line count
      packages[index] = parse_package(lines[i + 1]! + lines[i + 2]! + lines[i + 3]!)
      i += 3;
    } else if (region_declaration.test(line)) {
      regions.push(parse_region(line));
    }
  }

  // Do the stupid math
  regions.forEach((region, i) => {
    // Presents count guaranteed to match packages count
    let squares_needed = region.presents.reduce((prev, curr, idx) => {
      return prev + (curr * packages[idx]!);
    }, 0);

    if (squares_needed < region.area) solution += 1;
  });

  console.log('The solution to part_one is:', solution);
}

// Just get the count of the number of X characters in all three lines
function parse_package(block: string): number {
  let count = 0;
  for (let i = 0; i < block.length; i++) {
    if (block[i] === '#') count++;
  }
  return count;
}

function parse_region(line: string) {
  const [area_str, presents_str] = line.split(':').map(s => s.trim());
  const [x, y] = area_str!.split('x').map(Number);
  const presents = presents_str!.split(' ').map(Number);

  return { area: x! * y!, presents };
}

run();
