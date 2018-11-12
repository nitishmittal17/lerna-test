const fs = require('fs');
const execSync = require('child_process').execSync;
const npmRegistry = 'http://localhost:4873/';

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

console.log('Publishing the changes..');
execSync(`lerna publish patch --registry ${npmRegistry} --loglevel silent --yes`);

console.log('Changes published. Saving to database..');
output = execSync(`lerna list --loglevel silent --json`);
let newList = JSON.parse(output);

const getRequestPromise = (url, type, params) => {
	return new Promise(function(resolve, reject) {
		//Make request to some api call to save the data
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
	data.name = newWidgetDetails.name;
	data.newVersion = newWidgetDetails.version;
	data.html = fs.readFileSync(newWidgetDetails.location + '/index.handlebars','utf8');
	promiseArray.push(getRequestPromise('', 'POST', data))
}

Promise.all(promiseArray).then(function(result) {
	result.forEach(row => {
		if (row.status === 'success') {
			console.log(`Package published successfully - ${row.params.name}@${row.params.newVersion}`)
		} else {
			console.log(`Error in publishing package - ${row.params.name}.. Reverting..`);
			console.log('unpublishing from npm');
			execSync(`npm unpublish --force --registry ${npmRegistry} ${row.params.name}@${row.params.newVersion}`);
			//console.log('Removing local tag');
			//execSync(`git tag -d ${row.params.name}@${row.params.newVersion}`);
			//console.log('Removing remote tag');
			//execSync(`git push --delete origin ${row.params.name}@${row.params.newVersion}`);
		}
	})
});