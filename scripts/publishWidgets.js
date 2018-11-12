const fs = require('fs');
const execSync = require('child_process').execSync;

let output, changes;

//Check if there are any unsaved changes. if found, abort the process
output = execSync('git status --porcelain --null');
if (output.toString() !== '') {
	console.log('You have changes to commit. Please commit the changes before publishing.');
	process.exit();
}

//Check if there is any change since last publish. If no change found, abort the process.
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

//npm unpublish --force --registry http://localhost:4873/ floating-bar@1.0.18
//Remove local tag - git tag -d floating-bar@1.0.18
//Remove remote tag - git push --delete origin floating-bar@1.0.18

console.log('Publishing the changes..');
execSync(`lerna publish patch --registry http://localhost:4873/ --loglevel silent --yes`);

console.log('Changes published. Saving to database..');
output = execSync(`lerna list --loglevel silent --json`);
let newList = JSON.parse(output);

const getRequestPromise = (url, type, params) => {
	return new Promise(function(resolve, reject) {
		//Make request to some api call to save the data
		console.log(params);
		resolve({
			status: 'success',
			params: params
		});
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

Promise.all(promiseArray).then(function(ouput) {

});