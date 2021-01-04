var nutritionFields = ['Refugees', 'Asylum',
    'Internally Displaced', 'Stateless Persons',
    'Others of Concern'];

d3.csv("assets/csv/rwanda-data.csv", function (error, data) {
    var cerealMap = {};
    data.forEach(function (d) {
        var cereal = d.Year;
        cerealMap[cereal] = [];

        // { cerealName: [ bar1Val, bar2Val, ... ] }
        nutritionFields.forEach(function (field) {
            cerealMap[cereal].push(+d[field]);
        });
    });
    makeVis_rwa(cerealMap);
});

var makeVis_rwa = function (cerealMap) {
    // Define dimensions of vis
    var margin = { top: 30, right: 20, bottom: 50, left: 100 },
        width = 550 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    // Make x scale
    var xScale = d3.scaleBand()
        .domain(nutritionFields)
        .rangeRound([0, width])
        .padding(0.1);

    // Make y scale, the domain will be defined on bar update
    var yScale = d3.scaleLinear()
        .range([height, 0]);

    // Create canvas
    var canvas = d3.select("#vis-container-rwa")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Make x-axis and add to canvas
    var xAxis = d3.axisBottom(xScale);

    canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll(".tick text")
        .call(wrap, xScale.bandwidth());

    // Make y-axis and add to canvas
    var yAxis = d3.axisLeft(yScale);

    var yAxisHandleForUpdate = canvas.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    yAxisHandleForUpdate.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");

    var updateBars = function (data) {
        // First update the y-axis domain to match data
        yScale.domain(d3.extent(data));
        yAxisHandleForUpdate.call(yAxis);

        var bars = canvas.selectAll(".bar").data(data);

        // Add bars for new data
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d, i) { return xScale(nutritionFields[i]); })
            .attr("width", xScale.bandwidth())
            .attr("y", function (d, i) { return yScale(d); })
            .attr("height", function (d, i) { return height - yScale(d); });

        // Update old ones, already have x / width from before
        bars
            .transition().duration(1000)
            .attr("y", function (d, i) { return yScale(d); })
            .attr("height", function (d, i) { return height - yScale(d); });

        // Remove old ones
        bars.exit().remove();
    };

    // Handler for dropdown value change
    var dropdownChange = function () {
        var newCereal = d3.select(this).property('value'),
            newData = cerealMap[newCereal];

        updateBars(newData);
    };

    // Get names of cereals, for dropdown
    var cereals = Object.keys(cerealMap).sort();

    var dropdown = d3.select("#vis-container-rwa")
        .insert("select", "svg")
        .attr("class", "custom-select")
        .on("change", dropdownChange);

    dropdown.selectAll("option")
        .data(cereals)
        .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {
            return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
        });

    var initialData = cerealMap[cereals[0]];
    updateBars(initialData);
};