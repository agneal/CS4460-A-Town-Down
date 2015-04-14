DATA_FILE = "data_new.json"
var currentYear = 1980; //TODO - probably change this



VIOLENT_CRIMES = ["Murder and Non-Negligent Manslaughter", "Forcible Rape", "Robbery", "Aggravated Assault"];
PROPERTY_CRIMES = ["Burglary", "Larceny-Theft", "Motor Vehicle"];
//State regions from http://en.wikipedia.org/wiki/List_of_regions_of_the_United_States#Census_Bureau-designated_regions_and_divisions
STATE_REGION = {"Alabama": "South", "Alaska": "West", "Arizona": "West", "Arkansas": "South", "California": "West", "Colorado": "West", "Connecticut": "Northeast", "Delaware": "South", "District of Columbia": "South", "Florida": "South", "Georgia": "South", "Hawaii": "West", "Idaho": "West", "Illinois": "Midwest", "Indiana": "Midwest", "Iowa": "Midwest", "Kansas": "Midwest", "Kentucky": "South", "Louisiana": "South", "Maine": "Northeast", "Maryland": "South", "Massachusetts": "Northeast", "Michigan": "Midwest", "Minnesota": "Midwest", "Mississippi": "South", "Missouri": "Midwest", "Montana": "West", "Nebraska": "Midwest", "Nevada": "West", "New Hampshire": "Northeast", "New Jersey": "Northeast", "New Mexico": "West", "New York": "Northeast", "North Carolina": "South", "North Dakota": "Midwest", "Ohio": "Midwest", "Oklahoma": "South", "Oregon": "West", "Pennsylvania": "Northeast", "Rhode Island": "Northeast", "South Carolina": "South", "South Dakota": "Midwest", "Tennessee": "South", "Texas": "South", "Utah": "West", "Vermont": "Northeast", "Virginia": "South", "Washington": "West", "West Virginia": "South", "Wisconsin": "Midwest", "Wyoming": "West"};
STATE_SYMBOLS = {"Alabama": "AL", "Alaska": "AK", "American Samoa": "AS", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District Of Columbia": "DC", "Federated States Of Micronesia": "FM", "Florida": "FL", "Georgia": "GA", "Guam": "GU", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Marshall Islands": "MH", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Northern Mariana Islands": "MP", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Palau": "PW", "Pennsylvania": "PA", "Puerto Rico": "PR", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virgin Islands": "VI", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"};
STATE_SYMBOLS_REVERSE = {"AL": "Alabama","AK": "Alaska","AS": "American Samoa","AZ": "Arizona","AR": "Arkansas","CA": "California","CO": "Colorado","CT": "Connecticut","DE": "Delaware","DC": "District Of Columbia","FM": "Federated States Of Micronesia","FL": "Florida","GA": "Georgia","GU": "Guam","HI": "Hawaii","ID": "Idaho","IL": "Illinois","IN": "Indiana","IA": "Iowa","KS": "Kansas","KY": "Kentucky","LA": "Louisiana","ME": "Maine","MH": "Marshall Islands","MD": "Maryland","MA": "Massachusetts","MI": "Michigan","MN": "Minnesota","MS": "Mississippi","MO": "Missouri","MT": "Montana","NE": "Nebraska","NV": "Nevada","NH": "New Hampshire","NJ": "New Jersey","NM": "New Mexico","NY": "New York","NC": "North Carolina","ND": "North Dakota","MP": "Northern Mariana Islands","OH": "Ohio","OK": "Oklahoma","OR": "Oregon","PW": "Palau","PA": "Pennsylvania","PR": "Puerto Rico","RI": "Rhode Island","SC": "South Carolina","SD": "South Dakota","TN": "Tennessee","TX": "Texas","UT": "Utah","VT": "Vermont","VI": "Virgin Islands","VA": "Virginia","WA": "Washington","WV": "West Virginia","WI": "Wisconsin","WY": "Wyoming",};
STATE_COLORS = {"0":"#fee5d9", "1":"#fcbba1", "2":"#fc9272", "3":"#fb6a4a", "4":"#ef3b2c", "5":"#cb181d", "6":"#99000d", "defaultFill":"#aaa", "-1":"#aaa"};
NUM_DIVISIONS = 7;
var UNEMPLOYMENT = "Unemployment";

var screenWidth = screen.availWidth;
console.log("SCREEN WIDTH" + (screenWidth/2));
// chart.style.width = (screenWidth/2 - 10) + "px";
document.getElementById("map").style.width = (screenWidth/2 - 100) + "px";


var focus_state = null;


var currentYearData = null;

var DATA = null;

var margin = {
	top: 20,
	right: 20,
	bottom: 30,
	left: 50,
};

var width = (screenWidth/2) - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;



var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");

var map = new Datamap({
	element: document.getElementById("map"),
	scope: 'usa',
	fills: STATE_COLORS,
	data: {},
	geographyConfig: {
		borderColor: "#111",
		highlightOnHover: false,
		highlightFillColor: "#aaebff",
		highlightBorderColor: '#000',
		// popupOnHover: true,
		popupTemplate: function(geo, data){
			// console.log(geo);
			var html="<div><p>NOTHING</p></div>";
			var state = STATE_SYMBOLS_REVERSE[geo.id];
			if(DATA != null){
				var d = DATA[currentYear][state];
				html = dodHTML(d);
			}
			// console.log(html);
			return html;
		},
	},
	done: function(datamap){
		datamap.svg.selectAll(".datamaps-subunit").on("click", function(d){
			var state = STATE_SYMBOLS_REVERSE[d.id];

			if(focus_state == null){
				focus_state = {"Name": state};
			}
			else if(focus_state.Name===state){
					focus_state = null;
			}
			else{
				focus_state = null;
			}
			updateMarks();

		})
		.on("mouseover", function(geo){ 
			var state = STATE_SYMBOLS_REVERSE[geo.id];
			if(DATA != null){
				var d = DATA[currentYear][state];
				// html = dodHTML(d);
				plotMapDod(d);
			}
			// console.log(html);
			// return html;
		})
		.on("mouseout", function(geo){
			var state = STATE_SYMBOLS_REVERSE[geo.id];
			if(DATA != null){
				var d = DATA[currentYear][state];
				hideMapDetailsOnDemand(d);
			}
		});
	}
});
var dropdownVal = "All Violent Crime";
var dropdown = d3.select(".dropdown")
	.on("change", function(val){
		var newYaxisVal = this.options[this.selectedIndex].innerText;
		console.log(newYaxisVal);
		if(newYaxisVal === "All Property Crime")
			yValue = propertyCrimeRate; //TODO
		else if(newYaxisVal === "All Violent Crime")
			yValue = violentCrimeRate;
		else
			yValue = singleCrimeClosure(newYaxisVal);
		calculateYDomain();
		chart.select(".yaxis")
			.transition()
			.duration(200)
			.ease("sin-in-out")
			.call(yAxis);
		chart.select(".yaxislabel").text(newYaxisVal);
		d3.select("body").select("#map").select(".yaxislabel").text(newYaxisVal+" - Incidents/10k People");
		updateMarks();
		dropdownVal = newYaxisVal;

	});


var dodScatter = null;
var dodMap = null;




function aggregateCrimeClosure(array){
	return function(d){
		var numCrimes = 0;
		for(var i=0; i < array.length; i++){
			numCrimes += d[array[i]];
		}
		return numCrimes
	}
}

function singleCrimeClosure(label){
	return function(d){
		return d[label];
	}
}

var violentCrimeRate = aggregateCrimeClosure(VIOLENT_CRIMES);

var propertyCrimeRate = aggregateCrimeClosure(PROPERTY_CRIMES);


var xAxisLabel = "Unemployment Rate (%)";
var xValue = function(d){ return d[UNEMPLOYMENT];};
var xScale = d3.scale.linear().range([0, width]);
var xMap = function(d){return xScale(xValue(d));};
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.outerTickSize(1)
	.innerTickSize(0)
	.tickPadding(10);

var yAxisLabel = "All Violent Crime";
var yValue = violentCrimeRate;
var yScale = d3.scale.linear().range([height, 0]);
var yMap = function(d){return yScale(yValue(d));};
var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.tickSize(1)
	.tickPadding(10);


yAxisSVG = null;

//TODO - radius mapping
var radius = d3.scale.linear();


var mapColorValue = function(d){ return yValue(d) };//TODO
var mapColorScale = d3.scale.ordinal().range([0, 50, 100, 150, 200, 250, 300, 350]);
var mapColorAxis = d3.svg.axis()
	.scale(mapColorScale)
	.orient("top")
	.tickFormat(d3.format("d"))
	.outerTickSize(1)
	.innerTickSize(2)
	.tickPadding(0)
	.ticks(8);

var mapColorMap = function(d){return mapColorScale(mapColorValue(d))};

var cValue = function(d){return STATE_REGION[d["Name"]];};
var colors = d3.scale.category10();

var yCategoryMin = null;
var yCategoryMax = null;

function calculateYDomain(){
	var minVal = null;
	var maxVal = null;
	for(var year in DATA){
		var yearData = DATA[year]
		for(var state in yearData){
			var cur = yValue(yearData[state]);
			if(minVal === null || cur < minVal)
				minVal = cur;
			if(maxVal === null || cur > maxVal)
				maxVal = cur;
		}
	}
	yScale.domain([Math.max(minVal - 50, 0), maxVal + 50]);

	// mapColorScale.domain([minVal, maxVal]); //Will be changed later in the code?
}



function plotInit(){
	//Domains
	xScale.domain([0.0, 19.0]); //ONLY go to 25% for more interesting vis
	// yScale.domain([500,40000]);//TODO - calculate dynamically when I have more data
	
	var minViolent = null;
	var minProperty = null;

	var maxViolent = null;
	var maxProperty = null;

	var minPop = null;
	var maxPop = null;
	for(var year in DATA){
		delete DATA[year]["United States"]; //Ignore
		for(var state in DATA[year]){
			var pop = DATA[year][state]["Population"];

			if(minPop === null || pop < minPop)
				minPop = pop;
			if(maxPop === null || pop > maxPop)
				maxPop = pop;
		}
	}//TODO - overhaul this thing
	yCategoryMax = maxViolent;
	yCategoryMin = minViolent;
	// yScale.domain([minViolent - 50, maxViolent + 50]);
	calculateYDomain();
	radius.domain([0, maxPop]).range([7,22]);
	var sliderDiv = d3.select("#slider");
	sliderDiv.style.width = "100px";
	sliderDiv.style.height = "100px";
	slider = d3.slider()
		.axis(true).
		min(1980).
		max(2012).
		step(1)
		.on("slide", sliderChanged);
	dodScatter =  d3.select("body").append("div")//WTF? Line errors with slider
    .attr("class", "tooltip")
    .style("opacity", 0);

    dodMap = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

	//x axis
  	chart.append("g")
  		.style("fill","white")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.style("fill", "white")
		.attr("x", width)
		.attr("y", -6) //-6
		.style("text-anchor", "end")
		.text(xAxisLabel);

	//y axis
	yAxisSVG = chart.append("g").attr("class", "yaxis");
	yAxisSVG
		.style("fill","white")
		.call(yAxis)
		.append("text")
		.attr("class", "yaxislabel")
		.attr("transform", "rotate(-90)")
		.attr("y", 6) //6
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("fill","white")
		.text(yAxisLabel);



	var mapLegend = d3.select("#map").append("g");
	mapLegend.attr("class", "xaxis")
		.style("fill","white")
		.attr("transform", "translate(80," + 10+")")
		.call(mapColorAxis)
		.append("text")
		.attr("class", "yaxislabel")
		.style("fill","white")
		.attr("x", 0)
		.attr("y",25)
		.text("All Violent Crime - Incidents/10k People");
		// .append("text")
		// .attr("x", 0)
		// .attr("y", 0) //-6
		// .style("text-anchor", "end")
		// .text("TEST");

	for(var d in [0,1,2,3,4,5,6]){
		mapLegend.append("rect")
			.attr({
				"x": d*50,
				"y": 0,
				"width": 50,
				"height": 10,
				"fill": STATE_COLORS[d],
				"stroke":"white",
			});
			// console.log("FOREACH "+d);
	}

	sliderDiv.style("fill","white").call(slider);


}

function sliderChanged(event, value){
	currentYear = value
	if(DATA !== null)
		updateMarks();
}


function dataUnpacker(d){
	var result = [];
	for(var state in d){
		result.push(currentYearData[state]);
	}
	return result;
}

function plotDetailsOnDemand(d, dod){
	if(focus_state == null || (focus_state.Name == d.Name)){
		// return;
		dod.transition()
			.duration(200)
			.style("opacity", .9);
		dod.html(dodHTML(d));
	}
}

function plotScatterDod(d){
	plotDetailsOnDemand(d, dodScatter);
	dodScatter.style("left", (d3.event.pageX + 5) + "px")
	.style("top", (d3.event.pageY - 28) + "px");
}

function plotMapDod(d){
	plotDetailsOnDemand(d, dodMap);
	dodMap.style("left", (d3.event.pageX - parseInt(dodMap.style("width"))-10) + "px")
	.style("top", (d3.event.pageY - 20) + "px");//TODO - CHANGE
}

function dodHTML(d){
	var html = d["Name"] + " -- "+d["Population"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " people<hr />";
	html += "<p>"+Math.round(yValue(d))+" incidents / 10k people</p>";
	if(dropdownVal == "All Violent Crime"){
		html += "<hr/>"
		html += textPercentages(d, VIOLENT_CRIMES);
	}
	else if (dropdownVal === "All Property Crime"){
		html += "<hr/>"
		html += textPercentages(d, PROPERTY_CRIMES);
	}

	return html;
		
}

function textPercentages(d, arr){
	var text="";
	var total = yValue(d);
	for(var i = 0; i < arr.length; i++){
		var crime = arr[i];
		text += "<p>" + (100 * (singleCrimeClosure(crime)(d)/total)).toPrecision(3)+"% "+crime+"</p>";
	}
	return text;
}

function hideDod(d, dod){
	dod.transition()
		.duration(500)
		.style("opacity", 0);
}

function hidePlotDetailsOnDemand(d){
	hideDod(d, dodScatter);
}

function hideMapDetailsOnDemand(d){
	hideDod(d, dodMap);
}


function drawMarks(data){
	// debugger;
	currentYearData = data[currentYear];
	// console.log("currentYear");
	// console.log(currentYearData);
	// chart.transition().duration(2);
	// chart.selectAll(".dot").remove(); //TODO - transition?
	chart.selectAll(".dot")
		.data(dataUnpacker(currentYearData))
		.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("r", function(d){ return radius(d["Population"])})
		.attr("cx", xMap)
		.attr("cy", yMap)
		.style("fill", function(d){return colors(cValue(d))})
		.on("mouseover", plotScatterDod)
		.on("mouseout",hidePlotDetailsOnDemand)
		.on("mousedown", function(d){
			console.log("mousedown "+d.Name)
			if(focus_state == null){
				focus_state = d;
			}
			else if(focus_state.Name===d.Name){
					focus_state = null;
			}
			updateMarks();
		});
	var legend = chart.selectAll(".legend")
		.data(colors.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {return "translate(20," + (i*40) + ")"; });

	legend.append("rect")
		.attr("x", width - 60)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", colors);

      // draw legend text
	legend.append("text")
		.attr("x", width - 65)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.style("fill", "white")
		.text(function(d) {return d;});



	updateMarks();
	
}

function updateMarks(){

	chart.selectAll(".dot")
		.datum(function(prev){
			return DATA[currentYear][prev["Name"]];
		})
		.transition()
		.duration(200)
		.attr("r", function(d){ return radius(d["Population"])})
		.attr("cx", xMap)
		.attr("cy", yMap)
		.style("opacity",function(d){
			if(focus_state == null || focus_state.Name == d.Name) return 0.9;
			return 0.0;
		});

		//TODO - change radius to 0 for invisible marks to try to prevent mouseover bug?
	var currentYearData = DATA[currentYear];

	// console.log("transition");
	var mapColors = {};
	// console.log(currentYearData);


	var max = null;
	var min = null;
	for(var state in currentYearData){
		var val = yValue(currentYearData[state]);
		if(max == null || max < val)
			max = val;
		if(min == null || min > val)
			min = val;
	}
	console.log("min "+min+", max "+max);

	//Color legend (this is gonna be rough)
	var newDomain = [];
	for(var i = 0; i <= 7; i++){
		newDomain.push( Math.floor(min+ ((max-min)/7)*i));
	}
	mapColorScale.domain(newDomain);
	
	d3.select("#map").select(".xaxis")
		.transition()
		.duration(200)
		.call(mapColorAxis);
	d3.select("#map").select(".xaxislabel")
		.text("CHANGEED");

	for(var state in currentYearData){
		var idx=-1;
		if(focus_state == null || focus_state.Name == state){
			var value = yValue(currentYearData[state]);

			// idx = ((value - min) / (max - min)) * (NUM_DIVISIONS-1);
			// // console.log("OLD "+idx);
			// idx = (Math.ceil(idx));
			var idx = 0;
			for(var i = 0; i < 7; i++){
				if(value > mapColorScale.domain()[i]){
					idx = i;
					if(idx === 6)console.log("SIX");
				}
				else{
					break;
				}
			}
		}
		mapColors[STATE_SYMBOLS[state]] = {"fillKey" : idx+""};
	}

	map.updateChoropleth(mapColors);


}

function main(error, data){
	if(DATA === null)
		DATA = data;
	plotInit();
	
	drawMarks(DATA);
}


d3.json(DATA_FILE, main);

//Doesn't work
function play(){
	//Hardcoded. Maybe change later??
	for(var val = 1980; val < 2012; val++){
		slider.value(val);
		slider.on("slide")(null, val);

		val += 1;
	}
}
