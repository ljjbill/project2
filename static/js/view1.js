   
/*
################ FORMATS ##################
-------------------------------------------
*/


var 	formatAsPercentage = d3.format("%"),
		formatAsPercentage1Dec = d3.format(".1%"),
		formatAsInteger = d3.format(","),
		fsec = d3.time.format("%S s"),
		fmin = d3.time.format("%M m"),
		fhou = d3.time.format("%H h"),
		fwee = d3.time.format("%a"),
		fdat = d3.time.format("%d d"),
		fmon = d3.time.format("%b")
		;

/*
############# PIE CHART ###################
-------------------------------------------
*/



function dsPieChart(){

	// var dataset = [
	// 		{country: "Sam", measure: 0.30},
	//       {country: "Peter", measure: 0.25},
	//       {country: "John", measure: 0.15},
	//       {country: "Rick", measure: 0.05},
	//       {country: "Lenny", measure: 0.18},
	//       {country: "Paul", measure:0.04},
	//       {country: "Steve", measure: 0.03},
	// 	  {country: "Bill", measure: 0.03},
	//       ]
	// 	  ;
	
	const url = "/api/pie_chart"

	// var dataset = 
	d3.json(url, function (dataset) {
		// console.log(data);
		// return data
				var 	width = 400,
				height = 400,
				outerRadius = Math.min(width, height) / 2,
				innerRadius = outerRadius * .999,   
				// for animation
				innerRadiusFinal = outerRadius * .5,
				innerRadiusFinal3 = outerRadius* .45,
				color = d3.scale.category20()    //builtin range of colors
				;
			
		var vis = d3.select("#pieChart")
			.append("svg:svg")              //create the SVG element inside the <body>
			.data([dataset])                   //associate our data with the document
				.attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
				.attr("height", height)
					.append("svg:g")                //make a group to hold our pie chart
				.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    //move the center of the pie chart from 0, 0 to radius, radius
					;
					
		var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
				.outerRadius(outerRadius).innerRadius(innerRadius);

		// for animation
		var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
		var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

		var pie = d3.layout.pie()           //this will create arc data for us given a list of values
			.value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array

		var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
			.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
			.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
				.append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
					.attr("class", "slice")    //allow us to style things in the slices (like text)
                    .on("mouseover", mouseover)
                    .on("mouseover.toolTip_v1", tooltipin)
                        .on("mouseout", mouseout)
                        .on("mouseout.toolTip_v1", tooltipout)
						.on("click", up)
						;
						
			arcs.append("svg:path")
					.attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
					.attr("d", arc);     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
						// .append("svg:title") //mouseover title showing the figures
						// .text(function(d) { return d.data.country + ": " + formatAsPercentage(d.data.measure); })			

			d3.selectAll("g.slice").selectAll("path").transition()
					.duration(750)
					.delay(10)
					.attr("d", arcFinal )
					;
		
		// Add a label to the larger arcs, translated to the arc centroid and rotated.
		// source: http://bl.ocks.org/1305337#index.html
		arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
				.append("svg:text")
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
			//.text(function(d) { return formatAsPercentage(d.value); })
			.text(function(d) { return d.data.country; })
			;
			
			// Computes the label angle of an arc, converting from radians to degrees.
			function angle(d) {
				var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
				return a > 90 ? a - 180 : a;
			}
				
			
			// Pie chart title			
			vis.append("svg:text")
				.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.text("Olympics Medal Count")
			.attr("class","title")
			;		    


			
		function mouseover() {
		d3.select(this).select("path").transition()
			.duration(750)
						//.attr("stroke","red")
						//.attr("stroke-width", 1.5)
						.attr("d", arcFinal3)
						;
		}
		
		function mouseout() {
		d3.select(this).select("path").transition()
			.duration(750)
						//.attr("stroke","blue")
						//.attr("stroke-width", 1.5)
						.attr("d", arcFinal)
						;
		}
		
		function up(d, i) {
		
					/* update bar chart when user selects piece of the pie chart */
					//updateBarChart(dataset[i].country);
					updateBarChart(d.data.country, color(i));
					updateLineChart(d.data.country, color(i));
				
		}

        var toolTip_v1 = d3.select("body").append("div").attr("class", "toolTip_v1");

            // Step 2: Create "mouseover" event listener to display tooltip
        function tooltipin(d) {
            toolTip_v1.style("display", "block")
                .html(
                    `${formatAsPercentage(d.data.measure)}
                of the medals won by<hr><strong>${(d.data.country)}<strong>`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                ;
            }
            // Step 3: Create "mouseout" event listener to hide tooltip
        function tooltipout() {
                toolTip_v1.style("display", "none");
            };




	})
	// .then(data =>  {
	// 	console.log(data);
	//   });
	
	

	
}

dsPieChart();

/*
############# BAR CHART ###################
-------------------------------------------
*/


// var datasetBarChart = [
//     { country: "All", sports: "Oranges", measure: 63850.4963 }, 
//     { country: "All", sports: "Apples", measure: 78258.0845 }, 
//     { country: "All", sports: "Grapes", measure: 60610.2355 }, 
//     { country: "All", sports: "Figs", measure: 30493.1686 }, 
//     { country: "All", sports: "Mangos", measure: 56097.0151 }, 
//     { country: "Sam", sports: "Oranges", measure: 19441.5648 }, 
//     { country: "Sam", sports: "Apples", measure: 25922.0864 }, 
//     { country: "Sam", sports: "Grapes", measure: 9720.7824 }, 
//     { country: "Sam", sports: "Figs", measure: 6480.5216 }, 
//     { country: "Sam", sports: "Mangos", measure: 19441.5648 }, 
//     { country: "Peter", sports: "Oranges", measure: 22913.2728 }, 
//     { country: "Peter", sports: "Apples", measure: 7637.7576 }, 
//     { country: "Peter", sports: "Grapes", measure: 23549.7526 }, 
//     { country: "Peter", sports: "Figs", measure: 1909.4394 }, 
//     { country: "Peter", sports: "Mangos", measure: 7637.7576 }, 
//     { country: "John", sports: "Oranges", measure: 1041.5124 }, 
//     { country: "John", sports: "Apples", measure: 2430.1956 }, 
//     { country: "John", sports: "Grapes", measure: 15275.5152 }, 
//     { country: "John", sports: "Figs", measure: 4166.0496 }, 
//     { country: "John", sports: "Mangos", measure: 11803.8072 }, 
//     { country: "Rick", sports: "Oranges", measure: 7406.3104 }, 
//     { country: "Rick", sports: "Apples", measure: 2545.9192 }, 
//     { country: "Rick", sports: "Grapes", measure: 1620.1304 }, 
//     { country: "Rick", sports: "Figs", measure: 8563.5464 }, 
//     { country: "Rick", sports: "Mangos", measure: 3008.8136 }, 
//     { country: "Lenny", sports: "Oranges", measure: 7637.7576 }, 
//     { country: "Lenny", sports: "Apples", measure: 35411.4216 }, 
//     { country: "Lenny", sports: "Grapes", measure: 8332.0992 }, 
//     { country: "Lenny", sports: "Figs", measure: 6249.0744 }, 
//     { country: "Lenny", sports: "Mangos", measure: 11803.8072 }, 
//     { country: "Paul", sports: "Oranges", measure: 3182.399 }, 
//     { country: "Paul", sports: "Apples", measure: 867.927 }, 
//     { country: "Paul", sports: "Grapes", measure: 1808.18125 }, 
//     { country: "Paul", sports: "Figs", measure: 795.59975 }, 
//     { country: "Paul", sports: "Mangos", measure: 578.618 }, 
//     { country: "Steve", sports: "Oranges", measure: 2227.6793 }, 
//     { country: "Steve", sports: "Apples", measure: 3442.7771 }, 
//     { country: "Steve", sports: "Grapes", measure: 303.77445 }, 
//     { country: "Steve", sports: "Figs", measure: 2328.93745 }, 
//     { country: "Steve", sports: "Mangos", measure: 1822.6467 },
//     { country: "Bill", sports: "Mangos", measure: 2227.6793 }, 
//     { country: "Bill", sports: "Apples", measure: 3442.7771 }, 
//     { country: "Bill", sports: "Grapes", measure: 303.77445 }, 
//     { country: "Bill", sports: "One", measure: 1822.6467 },
//     { country: "Bill", sports: "Two", measure: 1822.6467 },
//     { country: "Bill", sports: "Three", measure: 1822.6467 },
//     ]
// 	;
	
	var country = "All";
    
    function datasetBarChosen(country,datasetBarChart) {
        var ds = [];
        for (x in datasetBarChart) {
             if(datasetBarChart[x].country==country){
                 ds.push(datasetBarChart[x]);
             } 
            }
        return ds;
    }
    
    
    function dsBarChartBasics() {

		
    
    // set initial country value
    
    
            var margin = {top: 30, right: 5, bottom: 20, left: 50},
            width = 500 - margin.left - margin.right,
           height = 250 - margin.top - margin.bottom,
            colorBar = d3.scale.category20(),
            barPadding = 1
            ;
            
            return {
                margin : margin, 
                width : width, 
                height : height, 
                colorBar : colorBar, 
                barPadding : barPadding
            }			
            ;
    }
    
    function dsBarChart() {

		const url2 = "/api/bar_chart"

	
	d3.json(url2, function (datasetBarChart) {
    
			var firstDatasetBarChart = datasetBarChosen(country,datasetBarChart);         	
			
			var basics = dsBarChartBasics();
			
			var margin = basics.margin,
				width = basics.width,
			height = basics.height,
				colorBar = basics.colorBar,
                barPadding = basics.barPadding
                labelx=margin.left+20
				;
							
			var 	xScale = d3.scale.linear()
								.domain([0, firstDatasetBarChart.length])
								.range([0, width])
								;
								
			// Create linear y scale 
			// Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
			// get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.  
			var yScale = d3.scale.linear()
					// use the max funtion to derive end point of the domain (max value of the dataset)
					// do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
				.domain([0, d3.max(firstDatasetBarChart, function(d) { return d.measure; })])
				// As coordinates are always defined from the top left corner, the y position of the bar
				// is the svg height minus the data value. So you basically draw the bar starting from the top. 
				// To have the y position calculated by the range function
				.range([height, 0])
				;
			
			//Create SVG element
			
			var svg = d3.select("#barChart")
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom+1000)
					.attr("id","barChartPlot")
					;
			
			var plot = svg
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
					;
						
			var barGroup= plot.selectAll("rect")
				.data(firstDatasetBarChart)
				.enter()
				.append("rect")
					.attr("x", function(d, i) {
						return xScale(i);
					})
				.attr("width", width / firstDatasetBarChart.length - barPadding)   
					.attr("y", function(d) {
						return yScale(d.measure);
					})  
					.attr("height", function(d) {
						return height-yScale(d.measure);
					})
					.attr("fill", "lightgrey")
					;
			
            // Step 1: Append tooltip div
            var toolTip_v1 = d3.select("body").append("div").attr("class", "toolTip_v1");

            // Step 2: Create "mouseover" event listener to display tooltip
            barGroup.on("mouseover", function(d) {
            toolTip_v1.style("display", "block")
                .html(
                    `<strong>${(d.sports)}<strong><hr>${d.measure}
                medal(s) won`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                ;
            })
            // Step 3: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function() {
                toolTip_v1.style("display", "none");
            });
                    

        
			// Add y labels to plot	
			
			
			/* moved to CSS			   
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "white")
			*/
			;
			
			// Add x labels to chart	
			
			var xLabels = svg
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + (margin.top + height+20)  + ")")
					;
			

            // var x=d3.scale().domain([0,firstDatasetBarChart.length]).range([0,width])
            
            // var xAxis =d3.svg.axis().scale(x);

            // svg.append("g")
            //     .attr("class", "x axis")
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(xAxis)
            //     .selectAll("text")
            //     .data(firstDatasetBarChart)
            //     .enter()
			// 	.append("text")
			// 	.text(function(d) { return d.sports;})
            //     .attr("y", 0)
            //     .attr("x", 9)
            //     .attr("dy", ".35em")
            //     .attr("transform", "rotate(90)")
            //     .style("text-anchor", "start");


			xLabels.selectAll("text.xAxis")
				.data(firstDatasetBarChart)
                .enter()
                .append("g")
				.append("text")
				.text(function(d) { return d.sports;})
				.attr("text-anchor", "end")
					// Set x position to the left edge of each bar plus half the bar width
								.attr("y", function(d, i) {
										return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
								})
                                
                                .attr("x", 15)
                                .attr("transform", "rotate(-90)")
				// .attr("dy", ".35em")
    			
				.attr("class", "xAxis")
				//.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
				;		
				
		
                
			
			svg.append("text")
				.attr("x", (width + margin.left + margin.right)/2)
				.attr("y", 25)
				.attr("class","title")				
				.attr("text-anchor", "middle")
				.text("Medals Breakdown by Sports")
				;
                })}
                
          
		
		
    
    dsBarChart();
    
     /* ** UPDATE CHART ** */
     
    /* updates bar chart on request */
    
    function updateBarChart(country, colorChosen) {

			const url2 = "/api/bar_chart"

	
			d3.json(url2, function (datasetBarChart) {
        
            var currentDatasetBarChart = datasetBarChosen(country,datasetBarChart);
            
            var basics = dsBarChartBasics();
        
            var margin = basics.margin,
                width = basics.width,
               height = basics.height,
                colorBar = basics.colorBar,
                barPadding = basics.barPadding
                ;
            
            var 	xScale = d3.scale.linear()
                .domain([0, currentDatasetBarChart.length])
                .range([0, width])
                ;
            
                
            var yScale = d3.scale.linear()
              .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
              .range([height,0])
              ;
              
         var svg = d3.select("#barChart svg");
         
         
    
        //  var plot = svg
            //     .append("g")
            //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            //     ;
              
           var plot = d3.select("#barChartPlot")
           .datum(currentDatasetBarChart);
        
        plot.selectAll("rect").remove();
    
        var barGroup=plot.selectAll("rect")
           .data(currentDatasetBarChart)
               .enter()
           .append("rect")
           
        plot.selectAll("rect")
                .attr("x", function(d, i) {
                    return xScale(i)+50;
                })
               .attr("width", width / currentDatasetBarChart.length - barPadding)   
                .attr("y", function(d) {
                    return yScale(d.measure)+30;
                })  
                .attr("height", function(d) {
                    return height-yScale(d.measure);
                })
                .attr("fill", colorChosen)
                ;
                
        // Step 1: Append tooltip div
        var toolTip_v1 = d3.select("body").append("div").attr("class", "toolTip_v1");

        // Step 2: Create "mouseover" event listener to display tooltip
        barGroup.on("mouseover", function(d) {
        toolTip_v1.style("display", "block")
            .html(
                `<strong>${(d.sports)}<strong><hr>${d.measure}
            medal(s) won`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
        })
        // Step 3: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function() {
            toolTip_v1.style("display", "none");
        });
    
        plot.selectAll("text")
          .data(currentDatasetBarChart)
          .enter()
          .append("text")
          .text(function(d) {
              return formatAsInteger(d3.round(d.measure));
          })
          .attr("text-anchor", "middle")
          // Set x position to the left edge of each bar plus half the bar width
          .attr("x", function(d, i) {
              return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
          })
          .attr("y", function(d) {
              return yScale(d.measure) + 14;
          })
          .attr("class", "yAxis")
                  /* Note that here we only have to select the elements - no more appending! */
              // plot.selectAll("rect")
              // .data(currentDatasetBarChart)
            //   .transition()
                // .duration(750)
                // .attr("x", function(d, i) {
                //     return xScale(i);
                // })
              //  .attr("width", width / currentDatasetBarChart.length - barPadding)   
                // .attr("y", function(d) {
                //     return yScale(d.measure);
                // })  
                // .attr("height", function(d) {
                //     return height-yScale(d.measure);
                // })
                // .attr("fill", colorChosen)
                // ;
            
            // plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
            // 	.data(currentDatasetBarChart)
            // 	.transition()
            // 	.duration(750)
            //    .attr("text-anchor", "middle")
            //    .attr("x", function(d, i) {
            //    		return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
            //    })
            //    .attr("y", function(d) {
            //    		return yScale(d.measure) + 14;
            //    })
            //    .text(function(d) {
            // 		return formatAsInteger(d3.round(d.measure));
            //    })
            //    .attr("class", "yAxis")					 
            // ;
            
    
            svg.selectAll("text.title") // target the text element(s) which has a title class defined
                .attr("x", (width + margin.left + margin.right)/2)
                .attr("y", 25)
                .attr("class","title")				
                .attr("text-anchor", "middle")
                .text(country + " Medals Breakdown by Sports")
            ;
            
            
            svg.selectAll("text.xAxis").remove()
    
            var xLabels = svg
                .append("g")
				.attr("transform", "translate(" + margin.left + "," + (margin.top + height+20)  + ")")
				
                ;
                
                
        
            xLabels.selectAll("text.xAxis")
              .data(currentDatasetBarChart)
              .enter()
              .append("text")
              .text(function(d) { return d.sports;})
              .attr("text-anchor", "end")
                // Set x position to the left edge of each bar plus half the bar width
                               .attr("y", function(d, i) {
                                       return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
                               })
              .attr("x", 15)
              .attr("transform", "rotate(-90)")
			  
			  .attr("class", "xAxis")
              .transition()
              .duration(750)
              //.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
              ;		
    })}

	

/*
############# LINE CHART ##################
-------------------------------------------
*/

// var datasetLineChart = [
//     { country: "All", year: 2008, measure: 289309 }, 
//     { country: "All", year: 2009, measure: 234998 }, 
//     { country: "All", year: 2010, measure: 310900 }, 
//     { country: "All", year: 2011, measure: 223900 }, 
//     { country: "All", year: 2012, measure: 234500 }, 
//     { country: "Sam", year: 2008, measure: 81006.52 }, 
//     { country: "Sam", year: 2009, measure: 70499.4 }, 
//     { country: "Sam", year: 2010, measure: 96379 }, 
//     { country: "Sam", year: 2011, measure: 64931 }, 
//     { country: "Sam", year: 2012, measure: 70350 }, 
//     { country: "Peter", year: 2008, measure: 63647.98 }, 
//     { country: "Peter", year: 2009, measure: 61099.48 }, 
//     { country: "Peter", year: 2010, measure: 87052 }, 
//     { country: "Peter", year: 2011, measure: 58214 }, 
//     { country: "Peter", year: 2012, measure: 58625 }, 
//     { country: "Rick", year: 2008, measure: 23144.72 }, 
//     { country: "Rick", year: 2009, measure: 14099.88 }, 
//     { country: "Rick", year: 2010, measure: 15545 }, 
//     { country: "Rick", year: 2011, measure: 11195 }, 
//     { country: "Rick", year: 2012, measure: 11725 }, 
//     { country: "John", year: 2008, measure: 34717.08 }, 
//     { country: "John", year: 2009, measure: 30549.74 }, 
//     { country: "John", year: 2010, measure: 34199 }, 
//     { country: "John", year: 2011, measure: 33585 }, 
//     { country: "John", year: 2012, measure: 35175 }, 
//     { country: "Lenny", year: 2008, measure: 69434.16 }, 
//     { country: "Lenny", year: 2009, measure: 46999.6 }, 
//     { country: "Lenny", year: 2010, measure: 62180 }, 
//     { country: "Lenny", year: 2011, measure: 40302 }, 
//     { country: "Lenny", year: 2012, measure: 42210 }, 
//     { country: "Paul", year: 2008, measure: 7232.725 }, 
//     { country: "Paul", year: 2009, measure: 4699.96 }, 
//     { country: "Paul", year: 2010, measure: 6218 }, 
//     { country: "Paul", year: 2011, measure: 8956 }, 
//     { country: "Paul", year: 2012, measure: 9380 }, 
//     { country: "Steve", year: 2008, measure: 10125.815 }, 
//     { country: "Steve", year: 2009, measure: 7049.94 }, 
//     { country: "Steve", year: 2010, measure: 9327 }, 
//     { country: "Steve", year: 2011, measure: 6717 }, 
//     { country: "Steve", year: 2012, measure: 7035 },
//     { country: "Bill", year: 2008, measure: 10125.815 }, 
//     { country: "Bill", year: 2009, measure: 7049.94 }, 
//     { country: "Bill", year: 2010, measure: 9327 },  
//     { country: "Bill", year: 2012, measure: 7035 }
//     ]
//     ;
    
    // set initial year value
    var country = "All";
    
    function datasetLineChartChosen(country,datasetLineChart) {
        var ds = [];
        for (x in datasetLineChart) {
             if(datasetLineChart[x].country==country){
                 ds.push(datasetLineChart[x]);
             } 
            }
        return ds;
    }
    
    function dsLineChartBasics() {
    
        var margin = {top: 20, right: 10, bottom: 0, left: 50},
            width = 500 - margin.left - margin.right,
            height = 160 - margin.top - margin.bottom
            ;
            
            return {
                margin : margin, 
                width : width, 
                height : height
            }			
            ;
    }
    
    
    function dsLineChart() {
		const url3 = "/api/line_chart"

	
			d3.json(url3, function (datasetLineChart) {
    
        var firstDatasetLineChart = datasetLineChartChosen(country,datasetLineChart);    
        
        var basics = dsLineChartBasics();
        
        var margin = basics.margin,
            width = basics.width,
           height = basics.height
            ;
    
        var xScale = d3.scale.linear()
            .domain([0, firstDatasetLineChart.length-1])
            .range([0, width])
            ;
    
        var yScale = d3.scale.linear()
            .domain([0, d3.max(firstDatasetLineChart, function(d) { return d.measure; })])
            .range([height, 0])
            ;
        
        var line = d3.svg.line()
            //.x(function(d) { return xScale(d.year); })
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d.measure); })
            ;
        
        var svg = d3.select("#lineChart").append("svg")
            .datum(firstDatasetLineChart)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            // create country and move it so that margins are respected (space for axis and title)
            
        var plot = svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("id", "lineChartPlot")
            ;
    
            /* descriptive titles as part of plot -- start */
		
		
		var total=d3.sum(firstDatasetLineChart, function(d) {
			return d.measure;
		  });
    
        plot.append("text")
            .text(total)
            .attr("id","lineChartTitle2")
            .attr("x",width/2)
            .attr("y",height/2)	
            ;
        /* descriptive titles -- end */
            
        plot.append("path")
            .attr("class", "line")
            .attr("d", line)	
            // add color
            .attr("stroke", "lightgrey")
            ;
          
        var circleGroup=plot.selectAll(".dot")
            .data(firstDatasetLineChart)
               .enter().append("circle")
            .attr("class", "dot")
            //.attr("stroke", function (d) { return d.measure==datasetMeasureMin ? "red" : (d.measure==datasetMeasureMax ? "green" : "steelblue") } )
            .attr("fill", function (d) { return d.measure==d3.min(firstDatasetLineChart, function(d) { return d.measure; }) ? "red" : (d.measure==d3.max(firstDatasetLineChart, function(d) { return d.measure; }) ? "green" : "white") } )
            //.attr("stroke-width", function (d) { return d.measure==datasetMeasureMin || d.measure==datasetMeasureMax ? "3px" : "1.5px"} )
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 3.5)
            .attr("stroke", "lightgrey")
            // .append("title")
            // .text(function(d) { return d.year + ": " + formatAsInteger(d.measure); })
            ;
            var toolTip_v1 = d3.select("body").append("div").attr("class", "toolTip_v1");

            // Step 2: Create "mouseover" event listener to display tooltip
        circleGroup.on("mouseover", function(d) {
            toolTip_v1.style("display", "block")
                .html(
                    `<strong>${(d.year)}<strong><hr>${d.measure}
                medal(s) won`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                ;
            })
            // Step 3: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function() {
                toolTip_v1.style("display", "none");
            });

        svg.append("text")
            .text("Total Medals Won")
            .attr("id","lineChartTitle1")	
            .attr("x",margin.left + ((width + margin.right)/2))
            .attr("y", 10)
            ;

        
    
    })}
    
    dsLineChart();
    
    
     /* ** UPDATE CHART ** */
     
    /* updates bar chart on request */
    function updateLineChart(country, colorChosen) {

		const url3 = "/api/line_chart"

	
		d3.json(url3, function (datasetLineChart) {
    
        var currentDatasetLineChart = datasetLineChartChosen(country,datasetLineChart);   
    
        var basics = dsLineChartBasics();
        
        var margin = basics.margin,
            width = basics.width,
           height = basics.height
            ;
    
        var xScale = d3.scale.linear()
            .domain([0, currentDatasetLineChart.length-1])
            .range([0, width])
            ;
    
        var yScale = d3.scale.linear()
            .domain([0, d3.max(currentDatasetLineChart, function(d) { return d.measure; })])
            .range([height, 0])
            ;
        
        var line = d3.svg.line()
        .x(function(d, i) { return xScale(i); })
        .y(function(d) { return yScale(d.measure); })
        ;
    
       var plot = d3.select("#lineChartPlot")
           .datum(currentDatasetLineChart)
           ;
           
        /* descriptive titles as part of plot -- start */
        var total=d3.sum(currentDatasetLineChart, function(d) {
			return d.measure;
		  });
        
        plot.select("text")
            .text(total)
            ;
        /* descriptive titles -- end */
        
        plot.selectAll("path").remove()

        plot.selectAll("circle").remove()


        plot.append("path")
            .attr("class", "line")
            .attr("d", line)	
            // add color
            .attr("stroke", colorChosen)
            ;
          
           var circleGroup=plot.selectAll(".dot")
            .data(currentDatasetLineChart)
               .enter().append("circle")
            .attr("class", "dot")
            //.attr("stroke", function (d) { return d.measure==datasetMeasureMin ? "red" : (d.measure==datasetMeasureMax ? "green" : "steelblue") } )
            .attr("fill", function (d) { return d.measure==d3.min(currentDatasetLineChart, function(d) { return d.measure; }) ? "red" : (d.measure==d3.max(currentDatasetLineChart, function(d) { return d.measure; }) ? "green" : "white") } )
            //.attr("stroke-width", function (d) { return d.measure==datasetMeasureMin || d.measure==datasetMeasureMax ? "3px" : "1.5px"} )
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 3.5)
            .attr("stroke", colorChosen)
            // .append("title")
            // .text(function(d) { return d.year + ": " + formatAsInteger(d.measure); })
            ;

        // plot
        // .select("path")
        //     .transition()
        //     .duration(750)			    
        //    .attr("class", "line")
        //    .attr("d", line)	
        //    // add color
        //     .attr("stroke", colorChosen)
        //    ;
           
        // var path = plot
        //     .selectAll(".dot")
        //    .data(currentDatasetLineChart)
        //    .transition()
        //     .duration(750)
        //    .attr("class", "dot")
        //    .attr("fill", function (d) { return d.measure==d3.min(currentDatasetLineChart, function(d) { return d.measure; }) ? "red" : (d.measure==d3.max(currentDatasetLineChart, function(d) { return d.measure; }) ? "green" : "white") } )
        //    .attr("cx", line.x())
        //    .attr("cy", line.y())
        //    .attr("r", 3.5)
        //    // add color
        //     .attr("stroke", colorChosen)
        //    ;
        var toolTip_v1 = d3.select("body").append("div").attr("class", "toolTip_v1");

            // Step 2: Create "mouseover" event listener to display tooltip
        circleGroup.on("mouseover", function(d) {
            toolTip_v1.style("display", "block")
                .html(
                    `<strong>${(d.year)}<strong><hr>${d.measure}
                medal(s) won`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                ;
            })
            // Step 3: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function() {
                toolTip_v1.style("display", "none");
            });   

        //    path
        //    .selectAll("title")
        //    .text(function(d) { return d.year + ": " + formatAsInteger(d.measure); })	 
        //    ;  
        
        
    
    })};