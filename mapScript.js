//This file is for test/demonstration purposes only. It should not be used for final project

//This is probably built in somewhere, but whatever
var STATE_SYMBOLS = {"Alabama": "AL", "Alaska": "AK", "American Samoa": "AS", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District Of Columbia": "DC", "Federated States Of Micronesia": "FM", "Florida": "FL", "Georgia": "GA", "Guam": "GU", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Marshall Islands": "MH", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Northern Mariana Islands": "MP", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Palau": "PW", "Pennsylvania": "PA", "Puerto Rico": "PR", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virgin Islands": "VI", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"};


VIOLENT_CRIMES = ["Murder and Non-Negligent Manslaughter", "Forcible Rape", "Robbery", "Aggravated Assault"];


DATA_FILE = "data_new.json"
var currentYear = 1980;

DATA = null;

var demoFills = {"high":"#cc112d", "medium":"#fafafa", "low":"#b4d455", defaultFill: 'purple'};
//TODO - have better range of colors
//Even better do this mathematically
var map = new Datamap({
	element: document.getElementById('chart'),
	scope: 'usa',
	fills: demoFills,
	// responsive:true,
	data : {

	},
	geographyConfig: {
		borderColor : "#000000",
	},
});
// map.resize();


function violentCrimeRate(d){
	var numCrimes = 0;
	for(var i=0; i < VIOLENT_CRIMES.length; i++){
		numCrimes += d[VIOLENT_CRIMES[i]];
	}
	return numCrimes
}
var minMedBound, maxMedBound;
function fillType(val){
	if(val < minMedBound)
		return "low";
	else if(val > maxMedBound)
		return "high";
	return "medium";
}

function stuff(){ //aaaaaaaaaaaaaaaaaaasfd
	//Computes stats on data for coloring
	var minViolent = null;
	var maxViolent = null;
	var avgViolent = null;
	var avgViolentCount = null;
	for(var year in DATA){
		delete DATA[year]["United States"];
		for(var state in DATA[year]){
			var rViolent = violentCrimeRate(DATA[year][state]);
			if(minViolent === null || rViolent < minViolent)
				minViolent = rViolent;
			if(maxViolent === null || rViolent > maxViolent)
				maxViolent = rViolent;
			avgViolent += rViolent; //Median would really be a better measure
			avgViolentCount += 1;
		}
	}
	avgViolent /= avgViolentCount;
	console.log("MIN "+minViolent+", MAX "+maxViolent+", AVG "+avgViolent);
	//Really bad way of doing things incoming
	minMedBound = avgViolent - (avgViolent/2);
	maxMedBound = avgViolent + (avgViolent/2);
	var colors = {};
	for(var state in DATA[currentYear]){
		if (STATE_SYMBOLS.hasOwnProperty(state)){
			colors[STATE_SYMBOLS[state]] = {};
			colors[STATE_SYMBOLS[state]]["fillKey"] = fillType(violentCrimeRate(DATA[currentYear][state]));	
		}
	}
	// debugger;
	console.log(colors);
	map.updateChoropleth(colors);
	// map.updateChoropleth({"MS":{"fillKey":"high"}});


}

d3.json(DATA_FILE, function(error, data){
	if(DATA === null)
		DATA = data;
	stuff();
});