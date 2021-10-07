import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

async function run() {
  const packageName = process.argv[2];
  publishToNpm(packageName);
}

run();

function publishToNpm(packageName: string) {
  const cwd = existsSync(join('packages', packageName, 'dist'))
    ? join('packages', packageName, 'dist')
    : join('packages', packageName);
  execSync(`npm publish --access public`, { cwd });
}
