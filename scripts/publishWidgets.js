const fs = require('fs');
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

output = execSync(`lerna list --loglevel silent --json`);
let newList = JSON.parse(output);
console.log(newList);

const getRequestPromise = (url, type, params) => {
	return new Promise(function(resolve, reject) {
		//Make request to some api call to save the data
		console.log(params);
		resolve();
	})
};

let promiseArray = [];
for (let i = 0; i < changes.length; i++) {
	let newWidgetDetails = newList.find(widget => widget.name === changes[i].name);

	let data = {};
	data.newVersion = newWidgetDetails.version;
	data.html = fs.readFileSync(newWidgetDetails.location + '/index.handlebars');
	promiseArray.push(getRequestPromise('', 'POST', data))
}

Promise.all(promiseArray).then(function() {
	console.log('Success');
}, function() {
	console.log('Error')
});