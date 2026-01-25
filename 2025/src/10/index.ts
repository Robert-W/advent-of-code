import path from 'node:path'
import { read_file } from '../utils/file';

async function run() {
  const filepath = path.resolve(__dirname, './files/data.txt')
  const file = await read_file(filepath);

  part_one(file);
  part_two(file);
}

function part_one(file: string) {
  let solution = 0;

  // TODO: Figure out how to store this as I start figuring out a potential
  // solution to this problem, just getting the parsing logic in order here
  file.split('\n').forEach(line => {
    const combinations: { [key: string]: number } = {};
    const [lights_str, ...buttons_raw] = line.split(' ');
    // Parse the light string out
    let lights = lights_str!.slice(1, lights_str!.length - 1);

    // Parse out the buttons as arrays of ints
    // pop the latest item off since that is joltage
    buttons_raw.pop();
    let buttons = buttons_raw
      .map(button_str => button_str.slice(1, button_str.length - 1))
      .map(button_str => {
        const data = new Uint16Array(lights.length);
        const positions = button_str.split(',').map(Number);
        for (const position of positions) data[position] = 1;
        return data;
      })

    const table = new Uint8Array(lights.length);
    const max_options = Math.pow(2, buttons.length);

    // Skip 0 which represents no buttons being pressed
    // TODO: What are we doing here, need to read this to try to understand
    // exactly whats going on.
    for (let i = 1; i < max_options; i++) {
      const buttons_pressed = [];
      let presses = 0;
      // Reset the table state
      table.fill(0);

      for (let button_idx = 0; button_idx < buttons.length; button_idx++) {
        // Clever way to ensure we turn on the correct button combinations, play
        // around with this a bit more to understand how exactly this works
        const adjusted_index = buttons.length - button_idx - 1;
        const button_value_bitwise = i >> adjusted_index;
        if ((button_value_bitwise & 1) !== 1) { continue; }

        presses++;
        const button = buttons[button_idx]!;
        // console.log('adjusted_index', adjusted_index, 'button_value_bitwise', button_value_bitwise, 'i', i)
        // console.log(button_idx, button);
        buttons_pressed.push(button_idx);

        for (let light_idx = 0; light_idx < lights.length; light_idx++) {
          table[light_idx]! += button[light_idx]!;
        }
      }

      // console.log('Iteration', i, 'buttons_pressed', buttons_pressed);

      // If the sum of the value stored at the index os even, that means the
      // light has been turned off, if it's odd, it has been turned on
      // rebulid the string of lights based on their final state after all the
      // presses for this combination have been completed
      let lights_local = '';
      for (const value of table) {
        lights_local += (value % 2 === 0) ? '.' : '#';
      }

      if (combinations[lights_local] === undefined) {
        combinations[lights_local] = presses;
      } else if (presses < combinations[lights_local]!) {
        combinations[lights_local] = presses;
      }
    }

    solution += combinations[lights]!;
  });

  console.log('Solution to part_one is:', solution);
}

type JoltageCombination = {
  presses: number,
  joltage: number[]
};

type Combinations = { [key: string]: JoltageCombination[] };

function part_two(file: string) {
  let solution = 0;

  file.split('\n').forEach(line => {
    const tokens = line.split(' ');
    // Remove the light pattern, we don't need it this time around
    const _ = tokens.shift();
    const joltage_str = tokens.pop()!;
    const joltages = joltage_str.slice(1, -1).split(',').map(Number);
    const buttons = tokens.map(token => {
      return token.slice(1, -1).split(',').map(Number);
    });

    const combos: Combinations = {};
    const max_options = Math.pow(2, buttons.length);

    for (let i = 0; i < max_options; i++) {
      let current_joltage = new Array(joltages.length).fill(0);
      let presses = 0;

      for (let button_idx = 0; button_idx < buttons.length; button_idx++) {
        // Still not really sure how this works, but it helps us test all
        // possible combinations of the buttons
        const negative_index = buttons.length - 1 - button_idx;
        const bitwise_value = i >> negative_index;
        if ((bitwise_value & 1) !== 1) continue;

        presses++;
        let button = buttons[button_idx]!;
        button.forEach(idx => current_joltage[idx]++);
      }

      const pattern = pattern_from_joltage(current_joltage);

      if (combos[pattern] === undefined) combos[pattern] = [];
      combos[pattern].push({ presses, joltage: current_joltage });
    }

    const cache = {};
    solution += count_presses(cache, combos, joltages);
  });

  console.log('Solution to part_two is:', solution);
}

function pattern_from_joltage(joltages: number[]): string {
  return joltages.map(joltage => joltage % 2).join('');
}

function count_presses(cache: { [key: string]: number }, combos: Combinations, joltages: number[]): number {
  const key = joltages.join();
  if (cache[key] !== undefined) return cache[key];

  let only_zeros = true;
  for (const joltage of joltages) {
    if (joltage < 0) return Infinity;
    if (joltage > 0) only_zeros = false;
  }

  if (only_zeros) return 0;

  const pattern = pattern_from_joltage(joltages);
  let total = Infinity;

  if (combos[pattern] === undefined) {
    cache[key] = total;
    return total;
  }

  for (const combo of combos[pattern]!) {
    const half = new Array(joltages.length);
    for (let idx = 0; idx < joltages.length; idx++) {
      const new_joltage = (joltages[idx]! - combo.joltage[idx]!) / 2;
      half[idx] = new_joltage;
    }
    const presses = combo.presses + 2 * count_presses(cache, combos, half);
    if (presses < total) total = presses;
  }

  cache[key] = total;
  return total;
}

run();
