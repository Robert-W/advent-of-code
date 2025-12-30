import { read_file } from '../utils/file.ts';
import path from 'node:path';

class Input {
  operation: string;
  numbers: number[];

  constructor() {
    this.operation = '';
    this.numbers = []
  }
}

async function run() {
  let filepath = path.resolve(__dirname, './files/data.txt');
  let data = await read_file(filepath);

  part_one(data);
  part_two(data);
}

function part_one(data: string) {
  let inputs: Input[] = [];
  let rows: string[][] = data
    .split('\n')
    .map(row => row.split(' ').filter(Boolean));

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;
    for (let j = 0; j < row.length; j++) {
      if (inputs[j] === undefined) inputs[j] = new Input();
      let current_input = inputs[j]!;

      if (i === rows.length - 1) {
        current_input.operation = row[j]!;
      } else {
        current_input.numbers.push(Number(row[j]));
      }
    }
  }

  const solution = calculate_total(inputs);
  console.log('The solution to part_one is:', solution);
}

function part_two(data: string) {
  let inputs: Input[] = [];
  let rows: string[][] = data
    .split('\n')
    .map(row => row.split(''));

  let numbers_rows = rows.slice(0,-1);
  let operators = rows.slice(-1)[0]!;
  let columns_length = numbers_rows[0]!.length;
  let input;

  for (let i = 0; i < columns_length; i++) {
    let operator_value = operators[i]!;
    let current_number = '';

    // If we encounter an operator character, create a new input
    if (operator_value !== ' ' && operator_value !== undefined) {
      input = new Input();
      input.operation = operator_value;
      inputs.push(input);
    }

    // Start building the number to insert based on the column
    for (let j = 0; j < numbers_rows.length; j++) {
      current_number += numbers_rows[j]![i];
    }

    let new_number = parseInt(current_number);
    if (!isNaN(new_number)) input!.numbers.push(new_number);
  }

  const solution = calculate_total(inputs);
  console.log('The solution to part_two is:', solution);
}

function calculate_total(input: Input[]): number {
  return input.reduce((total, current_input) => {
    return total + current_input.numbers.reduce((number_total, num) => {
      return current_input.operation === '*'
        ? number_total * num
        : number_total + num;
    }, current_input.operation === '*' ? 1 : 0);
  }, 0);
}

run();
