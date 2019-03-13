// cite: https://bl.ocks.org/micahstubbs/5c3b87ce4bc247340186
var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = window.innerWidth/2.5- margin.left - margin.right // Use the window's width 
  , height = window.innerWidth/2.5 - margin.top - margin.bottom; // Use the window's width

var xScale  = d3.scaleLinear()
    .domain([0,1])
    .range([margin.left, width - margin.right])

var yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height - margin.bottom, margin.top])

        
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            
// d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(d.fpr); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.tpr); }) // set the y values for the line generator 

// X axis  
var xAxis = svg.append("g")
               .attr("transform", `translate(0, ${height - margin.bottom})`)
               .call(d3.axisBottom().scale(xScale));

// Y axis
var yAxis = svg.append("g")
               .attr("transform", `translate(${margin.left}, 0)`)
               .call(d3.axisLeft().scale(yScale));
               

// X label
svg.append("text")
   .attr("y", height)
   .attr("x", width/2)
   .style("text-anchor", "middle")
   .text("False positive rate");
   
// Y label
svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 10)
   .attr("x", -width/2)
   .style("text-anchor", "middle")
   .text("True positive rate");
               
// base line
svg.append("g")
   .append("path")
   .attr('stroke', 'grey')
   .attr('stroke-width', '1.5px')
   .attr('fill', 'none')
   .attr("class", "base")
   .style("stroke-dasharray", ("3, 3"))
   .attr("d", line([{"fpr":0, "tpr":0}, {"fpr":1, "tpr":1}]));
   
function draw(data){
	svg.append("path")
	   .attr('stroke', 'blue')
	   .attr('stroke-width', '1.0px')
	   .attr('fill', 'red')
	   .attr("class", "roc")
	   .attr("d", line(data));
}

// send request to fetch data
function run() {
	var url = "http://localhost:5000/";
	var input = document.getElementsByName("input");
		for(var i=0; i<input.length; i++){
			if(input[i].checked){
				var temp = input[i].value;
			}
		}
	var C = document.getElementById("c").value;
	C = parseFloat(C).toFixed(2);
	url = url.concat(temp).concat("/").concat(C);
	d3.json(url, function(data){
		console.log(d3.selectAll(".roc").remove());
		draw(data);
	})
}