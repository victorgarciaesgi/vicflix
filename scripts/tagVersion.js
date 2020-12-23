const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function patchVersion() {
  const version = require('../package.json').version;
  const { stdout, stderr } = await exec(`git tag -a v${version} -m "version v${version}"`);
  console.log(`Added tag version v${version} to commit`);
}
patchVersion();
