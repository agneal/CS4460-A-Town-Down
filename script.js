var DATA_FILE = "fakeData.json"
var currentYear = 1980; //TODO - probably change this



var UNEMPLOYMENT = "Unemployment"
var VIOLENT_CRIME_TOTAL = "Violent Crime Total"

var currentYearData = null;


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


var xAxisLabel = "Unemployment"
var xValue = function(d){ return d[UNEMPLOYMENT];};
var xScale = d3.scale.linear().range([0, width]);
var xMap = function(d){return xScale(xValue(d));};
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.outerTickSize(1)
	.innerTickSize(0)
	.tickPadding(10);

var yAxisLabel = "Crime"
var yValue = function(d){return d[VIOLENT_CRIME_TOTAL];}; 
var yScale = d3.scale.linear().range([height, 0]);
var yMap = function(d){return yScale(yValue(d));};
var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.tickSize(1)
	.tickPadding(10);



function plotInit(){
	//Domains
	xScale.domain([0.0, 100.0]);
	yScale.domain([500,40000]);//TODO - calculate dynamically when I have more data
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
}


function main(error, data){
	plotInit();

	currentYearData = data[currentYear];

	for(var state in currentYearData){

	}
}


d3.json(DATA_FILE, main);