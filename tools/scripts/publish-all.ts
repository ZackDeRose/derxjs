import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import prompt from 'prompt';

const releaseTypes = ['major', 'minor', 'patch'] as const;
const packages = ['view-model', 'reducer'] as const;

async function run() {
  if (!areWeOnMainBranch()) {
    console.error('not on main branch');
    process.exit(1);
  }
  if (uncomittedChangesExist()) {
    console.error('uncommitted changes exist');
    process.exit(1);
  }
  const releaseType = process.argv[2];
  if (!isReleaseType(releaseType)) {
    console.error(`release type '${releaseType}' is not valid`);
    process.exit(1);
  }
  await promptForConfirmation();
  const nextVersion = getCurrentVersion(releaseType);
  console.error(nextVersion);
  publishEachPackage(nextVersion);
  gitCommit(nextVersion);
  bumpRepoVersion(nextVersion);
  pushToGithub();
}

run();

function getCurrentVersion(releaseType: ReleaseType): string {
  const packageVersion = JSON.parse(
    readFileSync('package.json').toString()
  ).version;
  const [major, minor, patch] = packageVersion.split('.');
  return [
    releaseType === 'major' ? `${+major + 1}` : major,
    releaseType === 'minor' ? `${+minor + 1}` : minor,
    releaseType === 'patch' ? `${+patch + 1}` : patch,
  ].join('.');
}

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

function gitCommit(version: string) {
  execSync(`git commit -am "Packages bumped for release: ${version}"`);
}

function bumpRepoVersion(version: string) {
  execSync(`npm version ${version}`);
}

type ReleaseType = typeof releaseTypes[number];
function isReleaseType(x: any): x is ReleaseType {
  return releaseTypes.includes(x);
}

function pushToGithub() {
  execSync('git push -f');
}

function publishEachPackage(versionNumber: string) {
  for (const packageName of packages) {
    execSync(
      `nx run ${packageName}:publish --args="--version=${versionNumber}"`
    );
  }
}
