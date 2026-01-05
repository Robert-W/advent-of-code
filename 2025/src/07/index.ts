import path from 'node:path';
import { read_file } from '../utils/file';

const SPLITTER = '^';
const EMPTY_SPACE = '.';

async function run() {
  const filepath = path.resolve(__dirname, './files/data.txt')
  const filedata = await read_file(filepath);

  part_one(filedata);
  part_two(filedata);
}

function part_one(filedata: string) {
  const data = filedata
    .split('\n')
    .map(row => row.split(''));

  const starting_index = data[0]!.indexOf('S');
  let number_of_splits = 0;
  let beam_indices = [starting_index];

  // For each row, check the beam indices, if it's a splitter, aka ^, then clear
  // out the current beam index and replace it with two more.
  for (let i = 1; i < data.length; i++) {
    let row = data[i]!;
    let new_indices: number[] = [];

    beam_indices.forEach(beam_location => {
      if (row[beam_location] === EMPTY_SPACE) {
        // Helpful for debugging if needed, but don't really need this;
        row[beam_location] = '|';
        new_indices.push(beam_location);
      } else if (row[beam_location] === SPLITTER) {
        row[beam_location - 1] = '|';
        row[beam_location + 1] = '|';
        new_indices.push(beam_location - 1);
        new_indices.push(beam_location + 1);
        number_of_splits++;
      }
    });

    beam_indices = new_indices;
  }

  console.log('The solution to part_one is:', number_of_splits);
}

// type Location = {
//   row: number,
//   col: number
// };

function part_two(filedata: string) {
  const data = filedata
    .split('\n')
    .map(row => row.split(''));

  const starting_index = data[0]!.indexOf('S');
  const paths = new Array(data.length).fill(0);

  paths[starting_index] = 1;

  for (let i = 1; i < data.length; i++) {
    let row = data[i]!;

    for (let j = 0; j < row.length; j++) {
      // If we do not have a splitter, then move on
      if (row[j] === SPLITTER) {
        // Set the value of the split locations. This will accumulate each time
        // paths collide on the same row, so . ^ . ^ ., equals 1 0 2 0 1, or on
        // the following row since paths is just an array spanning the row length
        paths[j - 1] += paths[j];
        paths[j + 1] += paths[j];

        // Clear the value at the split position so we don't count incorrectly
        paths[j] = 0;
      }

    }
  }

  // Sum up our paths
  let number_of_timelines = paths.reduce((acc, curr) => {
    return acc + curr
  }, 0);

  // WHile this DFS works, it will run forever and potentially crash due to the
  // amount of memory used, the above is a better more optimized solution
  // ==========================================================================
  // const starting_index = data[0]!.indexOf('S');
  // const queue: Location[] = [{ row: 0, col: starting_index }];
  // let number_of_timelines = 0;
  // let location;
  //
  // while (location = queue.pop()) {
  //   let next_row = location.row + 1;
  //
  //   // If we are at the end of the grid, increment the number of timelines
  //   if (next_row === data.length) {
  //     number_of_timelines++;
  //   }
  //   // If we have an empty space, add that location to the end of the queue
  //   else if (data[next_row]![location.col] === EMPTY_SPACE) {
  //     queue.push({ row: next_row, col: location.col })
  //   }
  //   // If we have a splitter, add the left and right locations to the beginnging
  //   // of the queue
  //   else if (data[next_row]![location.col] === SPLITTER) {
  //     queue.unshift({ row: location.row, col: location.col - 1 })
  //     queue.unshift({ row: location.row, col: location.col + 1 })
  //   }
  // }

  console.log('The solution to part_two is:', number_of_timelines);
}

run();
