// Cuando se obtengan los datos de almacenamiento se ejecuta la funcion
browser.storage.local.get().then(function (data) {
	let tableTime = [];
	//console.log("RAW");
	//console.log(Object.keys(data));
	for (const key of Object.keys(data)) {
		// Almacenamos los datos del amacenamiento en una tabla
		tableTime.push({ 'site' : key, 'time' : data[key]});
	}
	
	// Los reordenamos de mayor a menor
	tableTime.sort((x, y) => y.time - x.time);
	
	// Las de abajo a partir de la 5 las borramos
	//if (tableTime.lenght > 5) {
		//tableTime = tableTime.slice(0, 5);
	//}

	// Mostramos la tabla
	for (let i = 0; i < 5; i++) {
		let elid = 'item_' + (i+1);
		let line = document.getElementById(elid);
		if (i < tableTime.length) {
			line.getElementsByClassName('name')[0].textContent = tableTime[i].site;
			let timeVal = tableTime[i].time;
			if (timeVal 
			line.getElementsByClassName('time')[0].textContent =
				(Math.floor(tableTime[i].time /3600)).toFixed(1) + "h " 
			  + (Math.floor(tableTime[i].time % 3600) /60).toFixed(1) + "m "
			  + (Math.floor(tableTime[i].time % 60)) + "s";
			line.getElementsByClassName('bar')[0].style.width = 
				((tableTime[i].time / tableTime[0].time) * 350) + "px";
		} else {
			line.style.display = 'none';
		}
	}
});
