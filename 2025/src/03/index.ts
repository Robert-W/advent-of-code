import { process_file } from '../utils/file.ts'
import path from 'node:path';

async function run() {
  let filename = path.resolve(__dirname, './files/data.txt');
  let banks: string[] = await process_file(filename, str => str);

  part_one(banks);
  part_two(banks);
}

function part_one(banks: string[]) {
  const jolts: number[] = banks.map(bank => {
    let numbers = bank.split('').map(Number);
    let first_digit = String(Math.max.apply(null, numbers.slice(0, numbers.length - 1)));
    let location = bank.indexOf(first_digit);
    let second_digit = String(Math.max.apply(null, numbers.slice(location + 1)));

    return Number(first_digit + second_digit);
  });

  const solution = jolts.reduce((total, curr) => total + curr, 0);
  console.log('The solution to part one is: ', solution);
}

function part_two(banks: string[]) {
  const jolts: number[] = banks.map(bank => {
    let numbers = bank.split('').map(Number);
    let joltage = '';
    let location = -1;
    let length = numbers.length;

    for (let i = 11; i >= 0; i--) {
      let usable_numbers = numbers.slice(location + 1, length - i);
      let digit = String(Math.max.apply(null, usable_numbers));
      joltage += digit;
      location = bank.indexOf(digit, location + 1);
    }

    // console.log(joltage);

    return Number(joltage);
  });

  const solution = jolts.reduce((total, curr) => total + curr, 0);
  console.log('The solution to part two is: ', solution);
}

run();
