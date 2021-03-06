//global variables

var chartThisValue = "CLMUR";

var margin = {
    top: 50, 
    right: 20, 
    bottom: 50, 
    left: 50
    };
    
// now define width/height -- make sure responsive to browser
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

//parse date
var formatDate = d3.time.format("%Y-%m-%d");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(function(d) { 
        return d.toFixed(1)+"%"; 
    })

//define variables for line chart
var line = d3.svg.line()
    .x(function(d) { 
        return x(d["observation_date"]); 
    });

//define SVG
var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function type(d) {
  d["observation_date"] = formatDate.parse(d["observation_date"]);
  d["CLMUR"] = +d["CLMUR"];
  d["CLMURN"] = +d["CLMURN"];
  return d;
}

function setNav() {
    $(".btn").on("click", function (){
        
        $(".btn").removeClass("active");
        $(this).addClass("active");
        
        var val = $(this).attr("val");
        chartThisValue = val;
        updateLine();
    });
}
        
function updateLine() {
    line.y(function(d) { 
        return y(d[chartThisValue]); 
        });
    
    d3.select(".line")
        .transition()
        .duration(500)
        .attr("d", line);
}

//load data
d3.csv("columbia_unemployment2.csv", type, function(error, data) {
  if (error) throw error;
  
    setNav();

    var timeDomain = d3.extent(data, function(d) {
      return d["observation_date"];
    })
    
    var maxUnemployment = d3.max(data, function(d) {
      return d[chartThisValue];
    })
    
    x.domain(d3.extent(data, function(d) { 
      return d["observation_date"]; 
    }));
  
    y.domain(d3.extent(data, function(d) { 
      return d["CLMUR"]; 
    }));
    
    
//call axis functions
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", -20)
      .attr("x", 900)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Year");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", 6)
      .attr("x", 6) 
      .attr("dy", ".71em")
      .style("text-anchor", "start")
      .text("Unemployment Rate");

  svg.append("path")
      .datum(data)
      .attr("class", "line");

  updateLine();

});







