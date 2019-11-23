//get tapas
//Run these code in https://tapas.io/series/100daysineurope
var copyToClipboard = function(text) {
	var dummy = document.createElement("textarea");
	// to avoid breaking orgain page when copying more words
	// cant copy when adding below this code
	// dummy.style.display = 'none'
	document.body.appendChild(dummy);
	//Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
	dummy.value = text;
	dummy.select();
	document.execCommand("copy");
	document.body.removeChild(dummy);
}
var foo = function () {
	//find the script tag that has '_data' in its content.
	var scripts = document.getElementsByTagName('script');
	for (var i = 0; i < scripts.length; i++) {
		//check whether containing '_data'
		if (scripts[i].textContent.indexOf('_data') != -1) {
			//replace text to use global variable: window._data
			//var command = scripts[i].textContent.replace('var _data','window._data');
			//eval(command); //run text as code
			eval(scripts[i].textContent);
			break;
		}
	}
	for (var i = 0; i < _data.episodeList.length; i++) {
		_data.episodeList[i].imageSrcAll = [];

		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			// Process our return data
			if (xhr.status >= 200 && xhr.status < 300) {
				// What do when the request is successful
				console.log(i, 'success!', xhr);
				var returnObject = JSON.parse(xhr.response);
				//console.log(returnObject.data.html);

				//create document: https://stackoverflow.com/questions/9598791/create-a-dom-document-from-string-without-jquery
				var doctype = document.implementation.createDocumentType( 'html', '', '');
				var dom = document.implementation.createDocument('', 'html', doctype);
				processedHtml = returnObject.data.html.replace(/&/g, '&amp;').replace(/<br>/g, '<br />');
				try {
					dom.documentElement.innerHTML = processedHtml;

					//number of images in the chapter
					imgCount = dom.documentElement.querySelector('article.ep-contents').querySelectorAll('img').length;
					for (var j = 0; j < imgCount; j++) {
						imgSrc = dom.documentElement.querySelector('article.ep-contents').querySelectorAll('img')[j].attributes.src.nodeValue
						_data.episodeList[i].imageSrcAll.push(imgSrc)
					}
				}
				catch (err) {
					console.log(err, processedHtml);
				}
			}
		};
		var async = false;
		xhr.open('GET', 'https://tapas.io/episode/view/' + _data.episodeList[i].id, async);
		xhr.send();
	}
	console.log('endo');
	return _data;
};

var foo2 = function (_data){
	var result = '';
	for (var i = 0; i < _data.episodeList.length; i++) {
		result += ((i + 1) + '\t' + _data.episodeList[i].title + '\n');
		for (var j = 0; j < _data.episodeList[i].imageSrcAll.length; j++) {
			result += (_data.episodeList[i].imageSrcAll[j] + '\n');
		}
	}
	return result;
};