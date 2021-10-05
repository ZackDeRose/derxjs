import { execSync } from 'child_process';
import { join } from 'path';
import prompt from 'prompt';

async function run() {
  if (!areWeOnMainBranch()) {
    console.error('not on main branch');
    process.exit(1);
  }
  if (uncomittedChangesExist()) {
    console.error('uncommitted changes exist');
    process.exit(1);
  }
  const packageName = process.argv[2];
  const releaseType = process.argv[3];
  if (!isReleaseType(releaseType)) {
    console.error('release type param is not valid');
    process.exit(1);
  }
  await promptForConfirmation();
  bumpVersion(releaseType);
  publishToNpm(packageName);
  pushToGithub();
}

run();

function uncomittedChangesExist() {
  const statusMsg = execSync(`git status`).toString();
  return !statusMsg.includes('nothing to commit, working tree clean');
}

async function promptForConfirmation(): Promise<void> {
  const { response } = await prompt.get([
    {
      name: 'response',
      description: 'are you sure you want to bump the version and publish?',
    },
  ]);
  if ((response as string).toLowerCase() === 'y') {
    return;
    ``;
  }
  console.error('User confirmation not provided');
  process.exit(1);
}

function areWeOnMainBranch(): boolean {
  const output = execSync('git branch').toString();
  return output.includes('* main');
}

function bumpVersion(releaseType: 'major' | 'minor' | 'patch') {
  execSync(`npm version ${releaseType}`);
}

const releaseTypes = ['major', 'minor', 'patch'] as const;
type ReleaseType = typeof releaseTypes[number];
function isReleaseType(x: any): x is ReleaseType {
  return releaseTypes.includes(x);
}

function publishToNpm(packageName: string) {
  const cwd = join('packages', packageName);
  execSync(`npm publish --dry-run`, { cwd });
}

function pushToGithub() {
  execSync('git push');
}
