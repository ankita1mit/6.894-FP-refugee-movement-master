var margin = { top: 50, right: 50, bottom: 120, left: 110 },
    width = 860 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_line = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("assets/csv/yearly_totals.csv", function (data) {
    // List of groups (here I have one group per column)
    var allGroup = ["Refugees", "Asylum", "Internally Displaced", "Stateless Persons", "Others of Concern"]

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain([1950, 2020])
        .range([0, width]);

    let tickLabels = ['1950','1955','1960', '1965', '1970', '1975', '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020'];

    xAxis = d3.axisBottom(x)
    
    format = d3.timeFormat("%Y")
    svg_line.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis.tickFormat((d,i) => tickLabels[i]));

    // Add Y axis
    var y = d3.scaleLinear()
        // .domain([height, d3.max(data, function(d) { return d.Refugees; })])
        .domain([0, 50000000])
        .range([height, 0]);
    
        svg_line.append("g")
        .call(d3.axisLeft(y));

    // Initialize line with group a
    var line = svg_line
        .append('g')
        .append("path")
        .datum(data)
        .attr("d", d3.line()
            .x(function (d) { return x(+d.Year) })
            .y(function (d) { return y(+d.Refugees) })
        )
        .attr("stroke", function (d) { return myColor("Refugees") })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {

        // Create new data with the selection?
        var dataFilter = data.map(function (d) { return { Year: d.Year, value: d[selectedGroup] } })

        // Give these new data to update line
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function (d) { return x(+d.Year) })
                .y(function (d) { return y(+d.value) })
            )
            .attr("stroke", function (d) { return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function (d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})