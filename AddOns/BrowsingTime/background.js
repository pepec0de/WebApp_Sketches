let currentTab = null;

browser.tabs.onActivated.addListener((event) => currentTab = event.tabId);

// Hacemos el hilo bucle que va a ejecutar la funcion cada segundo para almacenar los datos de tiempo
setInterval(updateBrowseTime, 1000);

async function updateBrowseTime() {
	// DEBUG
	console.log("updateBrowseTime exec");
	// Comprobamos que la variable currentTab tiene valor
	if (!currentTab) return;
	
	// web nav frames
	let frames = null;
	
	// Lo que pretendemos hacer aqui es obtener una lista de los links de las pestañas a las que nos desplazamos
	try {
		// En esta lista obtenemos el id de todas las pestañas que tenemos abiertas
		frames = await browser.webNavigation.getAllFrames(
			{'tabId': currentTab});
	} catch(error) {
		console.log("ERROR at getting frames (updateBrowseTime) : " + error);
	}

	// Filtramos esta lista para que nos de solo la que tenemos visible
	let frame = frames.filter((frame) => frame.parentFrameId == -1)[0];

	// Comprobamos que el contenido sea http
	if (!frame.url.startsWith('http')) return;
	
	let hostname = new URL(frame.url).hostname;

	try {
		let seconds = await browser.storage.local.get({[hostname] : 0});
		browser.storage.local.set({[hostname]: seconds[hostname] + 1});
		console.log("Seconds: " + (seconds[hostname] + 1) + " recorded in " + hostname);
	} catch(error) {
		console.log("ERROR at recording seconds (updateBrowseTime) : " + error);
	}
}
