const fs = require('fs');
const execSync = require('child_process').execSync;

let output, changes;

output = execSync('git status --porcelain --null');
console.log(output.toString() === '');
console.log('13');

try {
	output = execSync(`lerna changed --loglevel silent --json`);
	changes = JSON.parse(output);
	changes.forEach(change => {
		console.log(`Changes found in package ${change.name}`);
	})
} catch(e) {
	console.log('No changes found to publish.');
	process.exit();
}

//npm unpublish --force --registry https://npm.wingify.com @wingify/${packageName}
//lerna publish --registry http://localhost:4873/
///lerna publish patch --registry http://localhost:4873/ --yes --loglevel silent --json

//npm unpublish --force --registry http://localhost:4873/ floating-bar@1.0.3
//Remove local tag - git tag -d 12345
//Remove remote tag - git push --delete origin tagName

console.log('Publishing the changes..');
execSync(`lerna publish patch --registry http://localhost:4873/ --loglevel silent --yes`);

console.log('Changes published. Saving to database..');
output = execSync(`lerna list --loglevel silent --json`);
let newList = JSON.parse(output);

const getRequestPromise = (url, type, params) => {
	return new Promise(function(resolve, reject) {
		//Make request to some api call to save the data
		console.log(params);
		reject();
	})
};

let promiseArray = [];
for (let i = 0; i < changes.length; i++) {
	let newWidgetDetails = newList.find(widget => widget.name === changes[i].name);

	let data = {};
	data.newVersion = newWidgetDetails.version;
	data.html = fs.readFileSync(newWidgetDetails.location + '/index.handlebars','utf8');
	promiseArray.push(getRequestPromise('', 'POST', data))
}

Promise.all(promiseArray).then(function() {
	console.log(`Successfully published ${changes.length} package(s).`);
}, function() {
	console.log('Error in publishing. Reverting packages')
});