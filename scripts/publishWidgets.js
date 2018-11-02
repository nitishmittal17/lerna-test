const execSync = require('child_process').execSync;

let output = execSync(`lerna changed --loglevel silent --json`);
let changes = JSON.parse(output);
console.log(changes);

//npm unpublish --force --registry https://npm.wingify.com @wingify/${packageName}
//lerna publish --registry http://localhost:4873/
///lerna publish patch --registry http://localhost:4873/ --yes --loglevel silent --json

//npm unpublish --force --registry http://localhost:4873/ floating-bar@1.0.3
//Remove local tag - git tag -d 12345
//Remove remote tag - git push --delete origin tagName

execSync(`lerna publish patch --registry http://localhost:4873/ --loglevel silent --yes`);

output = execSync(`lerna changed --loglevel silent --json`);
changes = JSON.parse(output);
console.log(changes);