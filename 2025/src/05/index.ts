import { read_file } from '../utils/file.ts';
import path from 'node:path';

type Range = {
  min: number,
  max: number,
};

type Inventory = {
  id_ranges: Range[],
  ids: number[]
}

async function run() {
  let filepath = path.resolve(__dirname, './files/data.txt');
  let filedata = await read_file(filepath);

  // Parse the file for ranges and ids
  let { id_ranges, ids } = parse_inventory(filedata);

  part_one(id_ranges, ids);
  part_two(id_ranges);
}

function parse_inventory(filedata: string): Inventory {
  // Parse the filedata into two sections
  let [ranges_str, ids_str] = filedata.split('\n\n')
    .map(section => section.split('\n'));

  let id_ranges = ranges_str!.map(range => {
    let values = range.split('-').map(Number);
    return { min: values[0]!, max: values[1]! };
  });

  let ids = ids_str!.map(Number);

  return { id_ranges, ids }
}

function part_one(id_ranges: Range[], ids: number[]) {
  let num_fresh = 0;

  parent: for (let i = 0; i < ids.length; i++) {
    const id = ids[i]!;

    for (let j = 0; j < id_ranges.length; j++) {
      let range = id_ranges[j]!;

      // If we are in bounds, increment the count
      if (range.min <= id && id <= range.max) {
        num_fresh++;
        continue parent;
      }
    }
  }

  console.log('The solution to part_one is: ', num_fresh);
}

function part_two(id_ranges: Range[]) {
  let unique_id_count = 0;

  // Sort the ranges based on their min value
  let sorted_ranges = id_ranges.sort((a, b) => a.min - b.min);

  // Make a pass, when there is overlap, keep moving the loop, when there isn't
  // commit the diff to unique_id_count and reset the low
  let range = sorted_ranges[0]!;

  for (let i = 1; i < sorted_ranges.length; i++) {
    const current = sorted_ranges[i]!;

    // If we are part of the previous range, continue
    if (current.max <= range.max) {
      continue;
    }
    // If we are not part of the same range, commit the diff to our count and
    // move our range
    else if (current.min > range.max) {
      unique_id_count += (range.max + 1) - range.min;
      range = current;
    }
    // If the min is part of the range but the max is higher, update our range's
    // max value to match the current max
    // 1-10, 5-7, 8-20
    else if (current.min <= range.max) {
      range.max = current.max;
    }
  }

  unique_id_count += (range.max + 1) - range.min;

  console.log('The solution to parttwo is: ', unique_id_count);
}

run();
