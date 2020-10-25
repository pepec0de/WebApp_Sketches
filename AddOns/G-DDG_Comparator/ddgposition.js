// Obtenemos las variables GET para obtener la string de la query
const queryString = window.location.search; 
const urlParams = new URLSearchParams(queryString);
 
// Comprobamos que tiene el parametro 'q' que nos interesa
if (urlParams.has('q')) {
	const searchQuery = urlParams.get('q');

	// Configuramos la peticion HTTP para obtener la pagina de la misma query en DuckDuckGo
	let xhr = new XMLHttpRequest();

	xhr.onload = function () {
	// Esta array nos dara la lista de links que se encuentra en la busqueda
	let results = Array.from(this.responseXML.getElementsByClassName('result')).map(result => result.getElementsByClassName('result__a')[0].href);
	
	// Eliminamos los links que son anuncios
	results = results.filter((result) => !result.startsWith('https://duckduckgo.com/y.js'));
	// Le pasamos la lista de links a nuestra funcion
	showResults(results);
	};

	xhr.onerror = function () {
	console.log('ERROR: HTTP Request failed to load.');
	};

	// Ejecutamos la peticion
	xhr.open('GET', 'https://html.duckduckgo.com/html/?q=' + searchQuery, true); // este true es para que la peticion sea asincronizada
	xhr.responseType = 'document';
	xhr.send();
} else {
	console.log('ERROR: Unable to find the query value.');
}

function showResults(results) {
	// DEBUG
	console.log(results);

	// Obtenemos una lista de elementos 'a' que son los resultados que nos da la busqueda de Google
	let googleResults = Array.from(document.getElementsByClassName('r')).map(result => result.getElementsByTagName('a')[0]);

	for (const gResult of googleResults) {
		// establish result URL.
		let url = gResult.href;
		// Comprobamos si algunos de los resultados estan redireccionados por Google
		if (url.startsWith(window.location.origin + '/url')) {
			const _urlParams = new URLSearchParams(url);
			if (_urlParams.has('url')) {
				url = _urlParams.get('url');
			} else {
				// Es un link "raro", luego pasamos a otro
				continue;
			}
		}
		// Comprobamos si el resultado aparece en DDG
		const ddgPosition = results.findIndex((element) => element === url);
		if (ddgPosition >= 0) {
			// Hacemos una cajita naranja con la posicion donde esta ese resultado en DDG
			gResult.insertAdjacentHTML('beforeend', '<div style="background-color: #de5833; position: absolute; top:0; right:0;"><p style="font-size: 15px; color: white; margin: 0; padding: 2px 9px 2px 9px;">'+(ddgPosition+1)+'</p></div>');
		}
	}
}
