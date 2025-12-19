import { process_file } from '../utils/file.ts'
import path from 'node:path';

// Range is inclusive on both ends, so [1, 4] means 1, 2, 3, and 4
type IDRange = [number, number];

async function run() {
  let filename = path.resolve(__dirname, './files/data.txt');
  let rows: Array<Array<IDRange>> = await process_file(filename, row_processor);
  // This particular file only has one row, may change process_file later if
  // more puzzles follow this parttern
  let ranges = rows[0]!;

  part_one(ranges);
  part_two(ranges);
}

// Rows look like this 1-4,5-9,3-6
function row_processor(row_data: string): Array<IDRange> {
  let ranges = row_data.split(',');
  let results: Array<IDRange> = [];

  ranges.forEach(range => {
    let id_range = range.split('-').map(Number) as IDRange;
    results.push(id_range);
  });

  return results;
}

// TODO: Benchmark two strategies for finding an even number of digits
// 1. Convert to string, check length % 2 === 0
// 2. Divide by 10 until no numbes remain, count the number of times we did the
// division.
// Would be interesting see CPU and Memory performance as well as ops/s
function part_one(ranges: Array<IDRange>) {
  let invalid_ids: Array<number> = [];

  ranges.forEach(range => {
    let [start, end] = range;
    for (let i = start; i <= end; i++) {
      let string_id = String(i);
      // invalid ids are numbers where it only contains some sequence of digits
      // repeated twice, if its odd, continue
      if (string_id.length % 2 !== 0) continue;
      // check if the string is two repeated sequences
      let midpoint = string_id.length / 2;
      if (string_id.substring(0, midpoint) === string_id.substring(midpoint)) {
        invalid_ids.push(i);
      }
    }
  });

  let sum = invalid_ids.reduce((prev, curr) => prev + curr, 0);
  console.log('The solution to part one is: ', sum);

}

function part_two(ranges: IDRange[]) {
  let invalid_ids: number[] = [];

  ranges.forEach(range => {
    let [start, end] = range;

    id_for:
    for (let i = start; i <= end; i++) {
      const string_id = String(i);

      // Only iterate through half the string, the pattern cannot repeat if is
      // longer than half the string
      pattern_for:
      for (let j = 1; j <= Math.floor(string_id.length / 2); j++) {
        const pattern = string_id.slice(0, j);
        // pointer to the starting location of the substring we want to check
        let location = j;
        while (location < string_id.length) {
          // If we don't have a match, then continue to the next character and
          // test the next pattern
          if (pattern !== string_id.slice(location, location + pattern.length)) continue pattern_for;
          // Move the pointer to test again
          location += pattern.length;
        }
        invalid_ids.push(i);
        continue id_for;
      }

    }
  });

  let sum = invalid_ids.reduce((prev, curr) => prev + curr, 0);
  console.log('The solution to part two is: ', sum);
}

run();
