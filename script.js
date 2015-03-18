DATA_FILE = "data_new.json"
var currentYear = 1980; //TODO - probably change this



VIOLENT_CRIMES = ["Murder and Non-Negligent Manslaughter", "Forcible Rape", "Robbery", "Aggravated Assault"];
PROPERTY_CRIMES = ["Burglary", "Larceny-Theft", "Motor Vehicle"];

var UNEMPLOYMENT = "Unemployment"


var currentYearData = null;

var DATA = null;

var margin = {
	top: 20,
	right: 20,
	bottom: 30,
	left: 90,
};

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;



var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");

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


function plotInit(){
	//Domains
	xScale.domain([0.0, 25.0]); //ONLY go to 25% for more interesting vis
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
			if(minViolent === null || rViolent < minViolent)
				minViolent = rViolent;
			if(maxViolent === null || rViolent > maxViolent)
				maxViolent = rViolent;

			if(minPop === null || pop < minPop)
				minPop = pop;
			if(maxPop === null || pop > maxPop)
				maxPop = pop;
		}
	}
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
	slider = sliderDiv.call(d3.slider()
		.axis(true).
		min(1980).
		max(2012).
		step(1)
		.on("slide", function(event, value){
			console.log(value);
			currentYear = value;
			if(DATA !== null)
				updateMarks();
				// drawMarks(DATA);
		}));
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
	console.log("currentYear");
	console.log(currentYearData);
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
		.style("fill", "red") //TODO
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
	
}

function updateMarks(){

	chart.selectAll(".dot")
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

	console.log("transition");
}

function main(error, data){
	if(DATA === null)
		DATA = data;
	plotInit();
	
	drawMarks(DATA);
}


d3.json(DATA_FILE, main);