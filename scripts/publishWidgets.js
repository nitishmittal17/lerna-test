const execSync = require('child_process').execSync;

let output = execSync(`lerna changed --loglevel silent --json`);
let changes = JSON.parse(output);

//npm unpublish --force --registry https://npm.wingify.com @wingify/${packageName}
//lerna publish --registry http://localhost:4873/
///lerna publish patch --registry http://localhost:4873/ --yes

//npm unpublish --force --registry http://localhost:4873/ floating-bar@1.0.3