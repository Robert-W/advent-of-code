import { read_file } from "../utils/file";
import path from 'node:path';

type DeviceMap = {
  [key: string]: string[]
}

const CONVERTER = 'dac';
const OUT = 'out';
const RACK = 'svr';
const TRANSFORMER = 'fft';
const YOU = 'you';

async function run() {
  const filepath = path.resolve(__dirname, './files/data.txt');
  const file = await read_file(filepath);

  const filepath_two = path.resolve(__dirname, './files/sample_two.txt');
  const file_two = await read_file(filepath_two);

  part_one(file);
  part_two(file);
}

function part_one(file: string) {
  const devices = generate_device_map(file);

  const queue = devices[YOU]!;
  let device = queue.shift()!;
  let solution = 0;

  while (device !== undefined) {
    // If we have reached the end, increment the result and move on
    if (device === OUT) {
      solution += 1;
    } else {
      let new_paths = devices[device]!;
      new_paths.forEach(path => queue.unshift(path));
    }

    device = queue.shift()!;
  }

  console.log('The solution to part one is: ', solution);
}

function part_two_incorrect(file: string) {
  const device_map = generate_device_map(file);

  // Old
  // let node: any = {
  //   parent: undefined,
  //   path: RACK
  // };
  // let queue = device_map[RACK]!;
  // let solution = 0;

  // while (queue.length !== 0) {
  //   let device = queue.shift()!;
  //   let current_node = { parent: node, path: device };
  //   node = current_node;

  //   if (device !== OUT) {
  //     device_map[device]!.forEach(device => queue.unshift(device))
  //   } else {
  //     path_is_valid(current_node);
  //   }
  // }

  // Works but is too slow on the actual data set
  // let solution = 0;
  // const stack = [{ device: RACK, path: RACK }];
  //
  // while (stack.length > 0) {
  //   const { device, path } = stack.pop()!;
  //
  //   if (device === OUT && path_is_valid(path)) {
  //     solution++;
  //     continue;
  //   }
  //
  //   const devices = device_map[device];
  //   if (devices) {
  //     devices.forEach(device => {
  //       stack.push({ device, path: path + device });
  //     });
  //   }
  // }

  let solution = 0;
  const stack = [{ device: RACK, has_converter: false, has_transformer: false }];

  while (stack.length > 0) {
    const { device, has_converter, has_transformer } = stack.pop()!;

    if (device === OUT) {
      if (has_converter && has_transformer) {
        solution++;
      }
      continue;
    }

    const devices = device_map[device];
    if (devices) {
      devices.forEach(new_device => {
        stack.push({
          device: new_device,
          has_converter: has_converter || new_device === CONVERTER,
          has_transformer: has_transformer || new_device === TRANSFORMER,
        });
      });
    }
  }

  console.log('The solution to part two is: ', solution);
}

function generate_device_map(file: string): DeviceMap {
  const device_map = file.split('\n').reduce((device_map, line) => {
    let [device_id, outputs]: string[] = line.split(':').map(s => s.trim());
    let devices: string[] = outputs!.split(' ').map(output => output);

    device_map[device_id!] = devices;
    return device_map;
  }, {} as DeviceMap);

  return device_map;
}

function part_two(file: string) {
  const device_map = generate_device_map(file);
  const memo = new Map<string, number>();

  function dfs(device: string, has_converter: boolean, has_transformer: boolean): number {
    if (device === OUT) {
      return has_converter && has_transformer ? 1 : 0;
    }

    const key = `${device}-${has_converter}-${has_transformer}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    let paths = 0;
    const devices = device_map[device];
    if (devices) {
      devices.forEach(next_device => {
        paths += dfs(
          next_device,
          has_converter || next_device === CONVERTER,
          has_transformer || next_device === TRANSFORMER
        );
      });
    }

    memo.set(key, paths);
    return paths;
  }

  const solution = dfs(RACK, false, false);
  console.log('The solution to part four is: ', solution);
}

run();
