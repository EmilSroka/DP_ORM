import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export async function prompt(prompt: string): Promise<string> {
  return new Promise((resolve) =>
    rl.question(prompt, resolve)
  );
}