import { Tree, formatFiles, installPackagesTask, Target } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function (tree: Tree, schema: any) {
  await libraryGenerator(tree, {
    name: schema.name,
    directory: '../packages',
    buildable: true,
  } as any);
  await createLicense(tree, schema.name);
  await adjustProjectJson(tree, schema.name);
  await createReadmeStub(tree, schema.name);
  await addToPublishScriptList(tree, schema.name);
  await updatePackageJson(tree, schema.name);
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}

async function updatePackageJson(tree: Tree, libName: string) {
  const packageJsonPath = `packages/${libName}/package.json`;
  const packageJsonContents = tree.read(packageJsonPath).toString();
  const packageJsonObj = JSON.parse(packageJsonContents);
  const monoRepoVersion = JSON.parse(
    tree.read('package.json').toString()
  ).version;
  packageJsonObj.name = `@derxjs/${libName}`;
  packageJsonObj.version = monoRepoVersion;
  packageJsonObj.main = 'dist/packages/reducer/index.js';
  (packageJsonObj.scripts = {
    test: 'echo "Error: no test specified" && exit 1',
  }),
    (packageJsonObj.repository = {
      type: 'git',
      url: 'git+https://github.com/ZackDeRose/derxjs.git',
    });
  packageJsonObj.keywords = ['rxjs', 'state-management'];
  packageJsonObj.author = 'Zack DeRose';
  packageJsonObj.license = 'MIT';
  packageJsonObj.bugs = {
    url: 'https://github.com/ZackDeRose/derxjs/issues',
  };
  packageJsonObj.homepage = 'https://github.com/ZackDeRose/derxjs#readme';
  packageJsonObj.dependencies = {
    rxjs: '^7.3.1',
    typescript: '^4.4.3',
  };
  tree.write(packageJsonPath, JSON.stringify(packageJsonObj));
}

async function addToPublishScriptList(tree: Tree, libName: string) {
  const publishAllScriptPath = `tools/scripts/publish-all.ts`;
  const code = tree.read(publishAllScriptPath).toString();
  const newCode = code.replace(
    'const packages = [',
    `const packages = ['${libName}', `
  );
  tree.write(publishAllScriptPath, newCode);
}

async function createReadmeStub(tree: Tree, libName: string) {
  tree.write(
    `packages/${libName}/LICENSE.md`,
    createReadmeBoilerPlate(libName)
  );
}

async function createLicense(tree: Tree, libName: string) {
  tree.write(`packages/${libName}/LICENSE.md`, MIT_LICENSE_CONTENTS);
}

async function adjustProjectJson(tree: Tree, name: string) {
  const projectJsonPath = `packages/${name}/project.json`;
  const projectStr = replaceAll(
    tree.read(projectJsonPath).toString(),
    'libs/../packages',
    'packages'
  );
  const project = JSON.parse(projectStr);
  project.targets.publish = createPublishTarget(name);
  project.root = `packages/${name}`;
  project.targets.build.outputPath = `packages/${name}/dist`;
  tree.write(projectJsonPath, JSON.stringify(project));
}

function createPublishTarget(name: string) {
  return {
    executor: `@nrwl/workspace:run-commands`,
    options: {
      commands: [
        `rm -rf packages/${name}/dist`,
        `npx ts-node tools/scripts/bump-version.ts ${name} {args.version}`,
        `nx build ${name}`,
        `npx ts-node tools/scripts/publish.ts ${name}`,
      ],
      parallel: false,
    },
  };
}

const MIT_LICENSE_CONTENTS = `MIT License

Copyright (c) 2021 Zachary DeRose

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

const createReadmeBoilerPlate = (
  libName: string
) => `**Note: This API is Subject to Change!**
_(@derxjs/view-model is stable however)_

# @derxjs/${libName}

Because your state management code should be domain-agnostic.

<p align="center">
    <img src="https://github.com/ZackDeRose/derxjs/blob/main/derxjs-logo.jpg" height="400px"/>
</p>

## Installation

\`\`\`bash
npm i @derxjs/${libName}
\`\`\`

## Usage

- More docs to come for 1.0.0 release

## Why @derxjs

### Domain-agnostic state-management

Your state management code should not depend on which framework or tools your project happens to be using at the time.

\`@derxjs/view-model\` is all about first-principles thinking and problem-solving. The pattern enforced by this package requires you to break down the inputs of your system - regardless of scope - to some set of inputs, represented as RxJS Observables, and

Future packages on the roadmap will provide utilities for implementing this pattern (\`@derxjs/reducer\` 👀), as well as ultilities for plugging this pattern into popular front-end frameworks (\`@derxjs/react\` 👀).

### Separation of concerns

We solved this a long time ago. Programming to interfaces allows us to put a joint in our wrokflows that allows for parallel work to be completed by multiple developers, and lets your team play to their strengths.

<p align="center">
    <img src="https://github.com/ZackDeRose/derxjs/blob/main/separation-of-tasks.png" />
</p>

This allows for easy transitions into other implementations, frameworks, as well as implementing the facade, adapter, and proxy patterns from the Gang of Four.

### Complimentary to all existing state-management libraries

We're not here to take a shot at the king ([👑](https://ngrx.io/)👀) - we're just here to help out where we can!

The \`@derxjs/view-model\` package is designed to work with with any other state management frameworks that can expose state or events as an Observable, making it a great compliment to any and all existing code in your codebase.

### Future-Proof Code

Domain-agnostic first-principles-based code will never go out of style 🌲.

As long as JavaScript is the language of the web, your state-management code will be valid.

Go ahead, change to that trendy new framework. Your @derxjs code will still work just fine :).

### Simplicity && Elegence

The \`DeRxJSViewModel\` type is the \`E = mc^2\` of state management.

Deceptively simple, but elegant enough to encompass any && all of your state management requirements.

<p align="center">
    <img src="https://github.com/ZackDeRose/derxjs/blob/main/the-derxjs-view-model-pattern.png" />
</p>

### TDD made awesome with timeline testing

Embrace TDD, using timeline testing to test your code with a whole new dimension of precision.

On the roadmap for \`@derxjs\` is a timeline test generation GUI tool that will take your Typescript interface code, and allow you to "draw" hypothetical timelines of events from your inputs - specifying what the output timeline for each hypothetical should look like.

This tool will generate \`.spec.ts\` files that you can paste directly into your repos for easy TDD, and coding the way we were meant to.

## @derxjs Roadmap

- @derxjs/view-model package ✅
- Article on TDD and implementing DeRxJS View Models (10/8/2021)
- Article on using DeRxJS View Models in different Frameworks (10/15/2021)
- @derxjs/reducer package (TBD; beta available now [you're looking at it!])
- Timeline Test Code Generation Tool (TBD)
- @derxjs/selector package (TBD)
- @derxjs/react package (TBD)
- Ai-Driven DeRxJS Code Generation (TBD)
`;

function replaceAll(
  fullText: string,
  toBeReplaced: string,
  replaceWith: string
): string {
  let toReturn = fullText;
  while (toReturn.includes(toBeReplaced)) {
    toReturn = toReturn.replace(toBeReplaced, replaceWith);
  }
  return toReturn;
}
