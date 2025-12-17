import path from 'node:path';
import { read_file } from '../utils/file.ts';

type Instruction = [string, number];

async function run() {
  // We don't care about errors in reading the file, let it throw
  let filepath = path.resolve(__dirname, './files/first.txt');
  let instructions: Array<Instruction> = await read_file(filepath, process_row);

  part_one(instructions);
  part_two(instructions);
}

function process_row(row: string): [string, number] {
  let direction = row.slice(0, 1);
  let distance = parseInt(row.slice(1));

  return [direction, distance];
}

function part_one(instructions: Array<Instruction>) {
  // Start the dial at position 50
  let current_position = 50;
  // Count the number of times the dial ends on zero
  let solution = 0;

  instructions.forEach((instruction) => {
    let [direction, distance] = instruction;

    current_position = direction === 'L'
      ? (current_position - distance + 100) % 100
      : (current_position + distance) % 100;

    if (current_position === 0) solution++;
  });

  console.log('The solution to part one is: ', solution);
}

function part_two(instructions: Array<Instruction>) {
  // Start the dial at position 50
  let current_position = 50;
  // Count the number of times the dial ends on zero
  let solution = 0;

  instructions.forEach((instruction) => {
    let [direction, distance] = instruction;

    // Increment the solution for the amount over 100
    solution += Math.floor(distance / 100);

    // Figure out how far to move in either direction
    let amount_to_move = distance % 100;

    // Calculate our next position
    let next_position = direction === 'L'
      ? current_position - amount_to_move
      : current_position + amount_to_move;

    // If we are not currently zero, increment the solution if we exceed bounds
    if (current_position !== 0) {
      if (direction === 'L' && next_position <= 0) solution++;
      else if (direction === 'R' && next_position >= 100) solution++;
    }

    // Update our position correctly
    current_position = next_position < 0
      ? (next_position + 100) % 100
      : next_position % 100;

  });

  console.log('The solution to part two is: ', solution);
}

run()
