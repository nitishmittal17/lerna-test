import handlebars from 'handlebars';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import './styles.scss';
import widgetTemplate from './template.handlebars';
import settingsJson from './settings.json';
import widgetFunctionalityText from './functionality.script';

const getQueryParameterByName = (name, url) => {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

//Get widget data for the template from the settings.json - default values
let widgetData = {
	layout: {

	},
	content: {

	},
	style: {

	}
};
window.widgetData = widgetData;

let selectedLayoutId = +getQueryParameterByName('layout') || 1;
let selectedLayout = settingsJson.layout.find(layout => layout.id === selectedLayoutId);

Object.assign(window.widgetData.layout, selectedLayout.dataKey);

settingsJson.content.forEach(contentBlock => {
	if (contentBlock.applicableLayouts.indexOf(selectedLayoutId) > -1) {
		let defaultValue = (contentBlock.layoutDefaultValues && contentBlock.layoutDefaultValues[selectedLayoutId]) || contentBlock.defaultValue;
		window.widgetData.content[contentBlock.dataKey] = defaultValue;
	}
});

settingsJson.style.forEach(styleBlock => {
	if (styleBlock.applicableLayouts.indexOf(selectedLayoutId) > -1) {
		let defaultValue = (styleBlock.layoutDefaultValues && styleBlock.layoutDefaultValues[selectedLayoutId]) || styleBlock.defaultValue;
		window.widgetData.style[styleBlock.dataKey] = defaultValue;
	}
});


let template = handlebars.compile(widgetTemplate);
let markup = `<section id="widget">${template(window.widgetData)}</section>`;
$('body').append(markup);

let widgetFunctionality = `<script>(${widgetFunctionalityText})($('#widget'), window.widgetData);</script>`;
$('body').append(widgetFunctionality);

