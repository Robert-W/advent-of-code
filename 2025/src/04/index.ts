import { process_file } from '../utils/file.ts';
import path from 'node:path';

type CELL = [number, number];

const ADJACENT_CELLS: CELL[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

async function run() {
  const filepath = path.resolve(__dirname, './files/data.txt');
  const matrix = await process_file(filepath, (data) => data.split(''));

  part_one(matrix);
  part_two(matrix);
}

function part_one(matrix: string[][]) {
  const solution = remove_rolls_of_paper(matrix);

  console.log('The solution to part one is ', solution);
}

function part_two(matrix: string[][]) {
  let solution = 0;
  let current_output = remove_rolls_of_paper(matrix, true);

  while (current_output > 0) {
    solution += current_output;
    current_output = remove_rolls_of_paper(matrix, true);
  }

  console.log('The solution to part two is ', solution);
}

function remove_rolls_of_paper(matrix: string[][], reset_removed: boolean = false): number {
  let solution = 0;
  let row_length = matrix.length;

  for (let row = 0; row < matrix.length; row++) {
    let col_length = matrix[row]!.length;
    for (let col = 0; col < row_length; col++) {
      // We can only remove rolls of paper, not empty spaces, if this is not a
      // roll of paper, then move to the next spot
      if (matrix[row]![col] !== '@') continue;

      let rolls_of_paper_count = 0;
      ADJACENT_CELLS.forEach(([row_to_check, col_to_check]) => {
        // Check the boundaries first so we dont error/count false positives
        if (row + row_to_check < 0 || col + col_to_check < 0 || row + row_to_check >= row_length || col + col_to_check >= col_length) {
          // this check is out of bounds
          return;
        }
        // If this cell is an @, then it is a roll of paper
        if (matrix[row + row_to_check]![col + col_to_check] === '@') {
          rolls_of_paper_count++;
        }
      });

      // If the rolls of paper count is 4 or more, we cannot count this
      // towards the total, if we are removing the papar, mark the original
      // matrix with the 'empty' cell
      if (rolls_of_paper_count < 4) {
        if (reset_removed) matrix[row]![col] = '.';
        solution++;
      }
    }
  }

  return solution;
}

run();
