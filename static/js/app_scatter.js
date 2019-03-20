var margin = {top: 10, right: 40, bottom: 40, left: 40},
    width = 1100 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.Year;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d["Noathelete"];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.Season;},
    color = d3.scale.category10();
  
   
   

// add the graph canvas to the body of the webpage
var svg = d3.select(".scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip_sc area to the webpage
// var tooltip_sc = d3.select(".scatter").append("div")
//     .attr("class", "tooltip_sc")
//     .style("opacity", 0)
// 	.style("display", "block")
// 	.style("color","Gray");
	
	

// load data
const url2 = "/api/scatter_plot"

var dataset = d3.json(url2, function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Year  = +d.Year ;
    d["Noathelete"] = +d["Noathelete"];
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);


  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "start")
      .text("Year");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("No Of Athlete");

  // draw dots
  var dotGroup2 = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("opacity", .6)
      .style("fill", function(d) { return color(cValue(d));}) ;


      var tooltip_sc = d3.select("body").append("div").attr("class", "tooltip_sc");

      // Step 2: Create "mouseover" event listener to display tooltip_sc
      dotGroup2.on("mouseover", function(d) {
      tooltip_sc.style("display", "block")
          .html("Sports: " + [d.Sports] + "<br/> (Year: " + xValue(d) + ", Number of Athletes: " + yValue(d) + ")")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })
      // Step 3: Create "mouseout" event listener to hide tooltip_sc
      .on("mouseout", function() {
          tooltip_sc.style("display", "none");
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 450)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 360)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
	  
});