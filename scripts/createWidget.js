const fs = require('fs');
const inquirer = require('inquirer');
const execSync = require('child_process').execSync;

const templateFolder = 'widget-template';
const widgetNamePlaceholder = '{{widgetName}}';

const questions = [
	{
		type: 'string',
		name: 'widgetName',
		message: 'Enter widget name:'
	}
];

/**
 * Read a list consisting of file names and the pattern(`to`) which needs to be modified with `with`
 * @param {Array} list
 */
function replacePlaceholdersInFiles(list) {
	for (let i = 0; i < list.length; i++) {
		let file = list[i].file;

		// Open a file to be get modified
		fs.readFile(file, 'utf8', function(err, data) {
			if (err) {
				return utils.log({
					type: 'error',
					msg: err
				});
			}

			// modify it by replacing all the occurrences of different patterns
			for (let j = 0; j < list[i].replace.length; j++) {
				let toReplace = list[i].replace[j].to;
				let withReplace = list[i].replace[j].with;
				let re = new RegExp(toReplace, 'g');

				data = data.replace(re, withReplace);
			}

			// Write file once all the occurrences of pattern have been modified
			fs.writeFile(file, data, 'utf8', function(err) {
				if (err) {

				}
			});
		});
	}
}

let addWidget = (widgetName) => {

	let folderPath = `widgets/${widgetName}`;

	//Try creating the widget directory
	try {
		execSync(`mkdir ${folderPath}`);
	} catch (e) {
		console.log(e);
		console.log('Folder can not be created. Ensure your current directory and the module with same name should not exist.');
		process.exit(0);
	}

	//Copy the files
	try {
		execSync(`cp ${templateFolder}/package.json ${folderPath}`);
		execSync(`cp ${templateFolder}/index.handlebars ${folderPath}`);
		execSync(`cp ${templateFolder}/README.md ${folderPath}`);
		execSync(`cp ${templateFolder}/styles.scss ${folderPath}`);

		//execSync(`mkdir ${folderPath}/build`);
		//execSync(`ln -sf build/webpack.config.js ${folderPath}/build/webpack.config.js`);
		//execSync(`ln -sf build/app.js ${folderPath}/build/app.js`);
	} catch (e) {
		console.log('Files could not be copied. Ensure your current directory and the file with same name should not exist.');
		process.exit(0);
	}

	//Replace placeholders with actual data
	let fileList = [
		{
			file: `${folderPath}/package.json`,
			replace: [
				{
					to: widgetNamePlaceholder,
					with: widgetName
				}
			]
		},
		{
			file: `${folderPath}/README.md`,
			replace: [
				{
					to: widgetNamePlaceholder,
					with: widgetName
				}
			]
		}
	];

	replacePlaceholdersInFiles(fileList);
};

inquirer.prompt(questions).then(answers => {
	addWidget(answers.widgetName);
});
