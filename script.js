DATA_FILE = "data_new.json"
var currentYear = 1980; //TODO - probably change this



VIOLENT_CRIMES = ["Murder and Non-Negligent Manslaughter", "Forcible Rape", "Robbery", "Aggravated Assault"];
PROPERTY_CRIMES = ["Burglary", "Larceny-Theft", "Motor Vehicle"];
//State regions from http://en.wikipedia.org/wiki/List_of_regions_of_the_United_States#Census_Bureau-designated_regions_and_divisions
STATE_REGION = {"Alabama": "South", "Alaska": "West", "Arizona": "West", "Arkansas": "South", "California": "West", "Colorado": "West", "Connecticut": "Northeast", "Delaware": "South", "District of Columbia": "South", "Florida": "South", "Georgia": "South", "Hawaii": "West", "Idaho": "West", "Illinois": "Midwest", "Indiana": "Midwest", "Iowa": "Midwest", "Kansas": "Midwest", "Kentucky": "South", "Louisiana": "South", "Maine": "Northeast", "Maryland": "South", "Massachusetts": "Northeast", "Michigan": "Midwest", "Minnesota": "Midwest", "Mississippi": "South", "Missouri": "Midwest", "Montana": "West", "Nebraska": "Midwest", "Nevada": "West", "New Hampshire": "Northeast", "New Jersey": "Northeast", "New Mexico": "West", "New York": "Northeast", "North Carolina": "South", "North Dakota": "Midwest", "Ohio": "Midwest", "Oklahoma": "South", "Oregon": "West", "Pennsylvania": "Northeast", "Rhode Island": "Northeast", "South Carolina": "South", "South Dakota": "Midwest", "Tennessee": "South", "Texas": "South", "Utah": "West", "Vermont": "Northeast", "Virginia": "South", "Washington": "West", "West Virginia": "South", "Wisconsin": "Midwest", "Wyoming": "West"};
STATE_SYMBOLS = {"Alabama": "AL", "Alaska": "AK", "American Samoa": "AS", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District Of Columbia": "DC", "Federated States Of Micronesia": "FM", "Florida": "FL", "Georgia": "GA", "Guam": "GU", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Marshall Islands": "MH", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Northern Mariana Islands": "MP", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Palau": "PW", "Pennsylvania": "PA", "Puerto Rico": "PR", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virgin Islands": "VI", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"};
STATE_COLORS = {"0":"#fee5d9", "1":"#fcbba1", "2":"#fc9272", "3":"#fb6a4a", "4":"#ef3b2c", "5":"#cb181d", "6":"#99000d", "defaultFill":"#aaa"};
NUM_DIVISIONS = 7;
var UNEMPLOYMENT = "Unemployment";




var currentYearData = null;

var DATA = null;

var margin = {
	top: 20,
	right: 20,
	bottom: 30,
	left: 50,
};

var width = 760 - margin.left - margin.right;
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
		borderColor: "#444",
		highlightOnHover: true,
		highlightFillColor: "#aaebff",
		highlightBorderColor: '#000'
	}
});

var dodScatter = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



function violentCrimeRate(d){
	var numCrimes = 0;
	for(var i=0; i < VIOLENT_CRIMES.length; i++){
		numCrimes += d[VIOLENT_CRIMES[i]];
	}
	return numCrimes
}



var xAxisLabel = "Unemployment Rate";
var xValue = function(d){ return d[UNEMPLOYMENT];};
var xScale = d3.scale.linear().range([0, width]);
var xMap = function(d){return xScale(xValue(d));};
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.outerTickSize(1)
	.innerTickSize(0)
	.tickPadding(10);

var yAxisLabel = "Violent Crime Rate"
var yValue = violentCrimeRate;
var yScale = d3.scale.linear().range([height, 0]);
var yMap = function(d){return yScale(yValue(d));};
var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.tickSize(1)
	.tickPadding(10);

//TODO - radius mapping
var radius = d3.scale.linear();


var cValue = function(d){return STATE_REGION[d["Name"]];};
var colors = d3.scale.category10();

var yCategoryMin = null;
var yCategoryMax = null;


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
			var rViolent = violentCrimeRate(DATA[year][state]);
			var pop = DATA[year][state]["Population"];
			//TODO - property
			//Actually, no recalculate y axis domain when its variable is changed
			if(minViolent === null || rViolent < minViolent)
				minViolent = rViolent;
			if(maxViolent === null || rViolent > maxViolent)
				maxViolent = rViolent;

			if(minPop === null || pop < minPop)
				minPop = pop;
			if(maxPop === null || pop > maxPop)
				maxPop = pop;
		}
	}//TODO - overhaul this thing
	yCategoryMax = maxViolent;
	yCategoryMin = minViolent;
	yScale.domain([minViolent - 50, maxViolent + 50]);
	radius.domain([0, maxPop]).range([7,22]);

	//x axis
  	chart.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("x", width)
		.attr("y", -6) //-6
		.style("text-anchor", "end")
		.text(xAxisLabel);

	//y axis
	chart.append("g")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6) //6
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(yAxisLabel);
	var sliderDiv = d3.select("#slider");
	sliderDiv.style.width = "100px";
	sliderDiv.style.height = "100px";
	slider = d3.slider()
		.axis(true).
		min(1980).
		max(2012).
		step(1)
		.on("slide", sliderChanged);
	sliderDiv.call(slider);
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
		.on("mouseover", function(d){
			dodScatter.transition()
				.duration(200)
				.style("opacity", .9);
			dodScatter.html(
				d["Name"]
			)
			.style("left", (d3.event.pageX + 5) + "px")
	        .style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d){
			dodScatter.transition()
            	.duration(500)
            	.style("opacity", 0);
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
		.text(function(d) {return d;})
	updateMarks();
	
}

function updateMarks(){

	chart.selectAll(".dot")
		.datum(function(prev){
			return DATA[currentYear][prev["Name"]];
		})
	// d3.selectAll("circle")
		// .data(dataUnpacker(DATA[currentYear]))
		// .enter()
		// .select("circle")
		.transition()
		.duration(200)
		// .ease(Math.sqrt)
		.attr("r", function(d){ return radius(d["Population"])})
		.attr("cx", xMap)
		.attr("cy", yMap);
		// .style("fill", "blue");
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
	}//Is this necessary? Or can we use global (regardless of year) min/max for the yValue

	for(var state in currentYearData){
		var value = yValue(currentYearData[state]);

		var idx = ((value - min) / (yCategoryMax - min)) * (NUM_DIVISIONS-1);
		idx = (Math.ceil(idx));//I'm not really feelin' this way of doing divisions
		//TODO - replace ^ 
		console.log(idx);
		mapColors[STATE_SYMBOLS[state]] = {"fillKey" : idx+""};
	}
	// console.log(colors)
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
