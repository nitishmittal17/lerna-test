const execSync = require('child_process').execSync;

let output = execSync(`lerna changed --loglevel silent --json`);
let changes = JSON.parse(output);

//npm unpublish --force --registry https://npm.wingify.com @wingify/${packageName}
//lerna publish --registry http://localhost:4873/