console.log("Hello world");

let index = 4;
let order = [
	"puzzle-welcome",
	"puzzle-car",
	"puzzle-selfie",
	"puzzle-boba",
	"puzzle-starbird",
	"puzzle-apartment",
	"puzzle-waffle",
	"puzzle-rockos",
	"puzzle-costco",
	"puzzle-base",
	"puzzle-conrgats",
	"puzzle-true-end",
];
let current : HTMLElement = null;
next();

let geoButton = document.getElementById("button-geo");
geoButton.onclick = () => {
	geo(() => {
		next();
	});
}

let carButton = document.getElementById("button-car");
carButton.onclick = () => {
	next();
}

let selfieButton = document.getElementById("button-selfie");
selfieButton.onclick = () => {
	geo((position : GeolocationPosition) => {
	  	const lat = 37.427997;
	  	const lon = -122.069500;
	  	const dist = calcCrow(lat, lon, position.coords.latitude, position.coords.longitude);

	  	let selfieClue = document.getElementById("clue-selfie");
	  	selfieClue.textContent = Math.floor(dist) + "m away!";

	  	if (dist <= 10) {
	  		next();
	  	}
	});
}

let bobaButton = document.getElementById("button-boba");
bobaButton.onclick = () => {
	let bobaText = <HTMLInputElement>document.getElementById("text-boba");

	let bobaClue = document.getElementById("clue-boba");
	if (bobaText.value.toLowerCase() === "in2u") {
		bobaClue.textContent = "BOG!!!";
		next();
	} else {
		bobaClue.textContent = "Password not bog enough :(";
	}
}

let starbirdButton = document.getElementById("button-starbird");
starbirdButton.onclick = () => {
	next();
}

let boxes = document.getElementsByClassName("puzzle-box");
let selected = new Set<HTMLElement>();
let numSolved = 0;

const selectedClass = "puzzle-box-selected";
const solvedClass = "puzzle-box-solved";
for (let i = 0; i < boxes.length; ++i) {
	let box = <HTMLElement>boxes[i];
	box.onclick = () => {
		if (box.classList.contains(solvedClass)) {
			return;
		}
		if (selected.has(box)) {
			box.classList.remove(selectedClass);
			selected.delete(box);
			return;
		}
		if (selected.size >= 4) {
			return;
		}
		box.classList.add(selectedClass);
		selected.add(box);

		if (selected.size === 4) {
			let category = ""
			for (let elm of selected) {
				for (let j = 0; j < elm.classList.length; ++j) {
					if (elm.classList[j].includes("cat")) {
						category = elm.classList[j];
						break;
					}
				}
				break;
			}
			if (category.length > 0) {
				let wrong = false;
				for (let elm of selected) {
					if (!elm.classList.contains(category)) {
						wrong = true;
						break;
					}
				}
				if (!wrong) {
					numSolved++;
					selected.forEach((elm : HTMLElement) => {
						elm.classList.add(solvedClass);
						elm.classList.remove(selectedClass);
					});
					selected.clear();

					document.getElementById(category + "-name").style.visibility = "visible";
				}
			}
		}

		if (numSolved >= 4) {
			starbirdButton.style.display = "block";
		}
	}
}

function next() {
	if (index >= order.length - 1) {
		console.log("At the end.");
		return;
	}

	console.log("Loading...");

	if (current !== null) {
		current.style.height = "0%";
		current.style.opacity = "0";
	}
	index++;
	if (index >= 0) {
		current = document.getElementById(order[index]);
		current.style.display = "block";
		current.style.height = "100%";
	}
}

function geo(cb : (pos : GeolocationPosition) => void) : void {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
	  	cb(position);
	  }, () => { console.error("GPS error"); },
	  { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });
	}
}

function calcCrow(lat1 : number, lon1 : number, lat2 : number, lon2 : number) {
	var R = 6371; // km
	var dLat = toRad(lat2-lat1);
	var dLon = toRad(lon2-lon1);
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c * 1000;
	return d;
}
function toRad(deg : number) : number {
    return deg * Math.PI / 180;
}