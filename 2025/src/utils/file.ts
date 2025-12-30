import { createReadStream } from 'node:fs';

export async function process_file<T>(file: string, row_parser: (data: string) => T): Promise<Array<T>> {
  let stream = createReadStream(file, 'utf-8');
  let results: Array<T> = [];

  for await (const chunk of stream) {
    // Add filter(Boolean) to remove extra blank line at end of chunk
    let rows: Array<string> = chunk.split('\n').filter(Boolean);
    rows.forEach(row => results.push(row_parser(row)));
  }

  return results;
}

export async function read_file(filepath: string): Promise<string> {
  let stream = createReadStream(filepath, 'utf-8');
  let data = '';

  for await (const chunk of stream) {
    data += chunk;
  }

  return data.trimEnd();
}
