import { execSync } from 'child_process';
import { join } from 'path';

async function run() {
  const packageName = process.argv[2];
  const versionNumber = process.argv[3];
  bumpVersion(packageName, versionNumber);
}

run();

function bumpVersion(packageName: string, version: string) {
  const cwd = join('packages', packageName);
  execSync(`npm version ${version}`, { cwd });
}
