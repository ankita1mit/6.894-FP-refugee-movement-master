const svg_rwanda = d3.select("#svg_map_rwanda")
const asylum_rwanda_data = "assets/json/refugee_summary.json"
const asylum_rwanda_data_all = "assets/json/refugee_processed.json"
var rwanda_processed = {}
var all_asylum_data_rwanda = {}
var world_map_rwanda = {}
const colorScheme_conflict_rwanda = d3.schemeRdBu[10];
const color_conflict_rwanda = d3.scaleThreshold()
    .domain([-100000, -10000, -1000, -100, 0, 100, 1000, 10000, 100000])
    .range(colorScheme_conflict_rwanda);
var centroid_conflict = {};
var cntry = {};
var centroid_country_conflict = []

var tooltip_conflict_rwanda = d3.select('#rwanda-map-container').append('div')
    .attr('class', 'hidden tooltip')
    .style("opacity", 0)

d3.queue()
    .defer(d3.json, asylum_rwanda_data)
    .defer(d3.json, asylum_rwanda_data_all)
    .defer(d3.json, world_data_path)
    .await(ready_rwanda);

function ready_rwanda(error, asylum_rwanda, asylum_data, world_info) {
    if (error) throw error;

    rwanda_processed = asylum_rwanda
    all_asylum_data_rwanda = asylum_data
    world_map_rwanda = world_info

    buildLegend_rwanda()

    svg_rwanda.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("fill", "white");

    svg_rwanda.append("path")
        .datum(graticule.outline)
        .attr("class", "foreground")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("fill", "white");

    updateSliderValue_rwanda(1994)
}

function buildLegend_rwanda() {

    //Append a defs (for definition) element to your SVG
    var defs = svg_rwanda.append("defs");

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");

    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

    //Append multiple color stops by using D3's data/enter step
    linearGradient.selectAll("stop")
        .data(color_conflict_rwanda.range())
        .enter().append("stop")
        .attr("offset", function (d, i) { return i / (color.range().length - 1); })
        .attr("stop-color", function (d) { return d; });

    //create tick marks
    var y = d3.scaleLinear()
        .domain([100000, -100000])
        .range([0, 300])

    var tick_numbers = [+100000, +50000, +25000, 0, -25000, -50000, -100000]

    var yAxis = d3.axisRight(y)
        .tickValues(tick_numbers)
        .tickFormat(d => {
            if (d == -100000) {
                return "<-100,000"
            }

            if (d == 500) {
                return ">+100,000"
            }

            if (d > 0) {
                return "+" + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }

            return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        })
    // .tickFormat(d3.format("+20"))
    // .tickValues();
    // .tickArguments([+10000, +5000, +1000, 0, -1000, -5000, -10000]);

    svg_rwanda.append('g')
        .attr("class", "y axis")
        .attr("transform", "translate(60,90)")
        .attr("width", 20)
        .call(yAxis)

    //Draw the rectangle and fill with gradient
    svg_rwanda.append("rect")
        .attr("width", 10)
        .attr("height", 300)
        .style("fill", "url(#linear-gradient)")
        .attr("transform", "translate(50, 90)");

    svg_rwanda.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", 150)
        .text("Rwandan Refugee Movement")
        .attr("dx", "-345")
        .attr("dy", "-110")
        .attr("transform", "rotate(-90)");
}

function updateSliderValue_rwanda(year) {
    nc_2 = rwanda_data_clean(all_asylum_data_rwanda, year)

    svg_rwanda.selectAll("path").remove()

    svg_rwanda.append("g")
        .selectAll("path")
        .data(topojson.feature(world_map_rwanda, world_map_rwanda.objects.countries).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "geoPath")
        .on("mouseover", function (d, i) {
            d3.select(this)
                .attr("stroke-width", 3)
                .style("fill", "grey");
        })
        .on('mousemove', function (d) {
            d3.select(this)
            var seekNum = nc_2[d.properties.name] || 0
            var takeNum = nc_2[d.properties.name] || 0
            var mouse = d3.mouse(svg_rwanda.node()).map(function (d) {
                return parseInt(d);
            })

            if (d.properties.name == "Rwanda") {
                tooltip_conflict_rwanda.classed('hidden', false)
                .style("opacity", 1)
                .style('left', mouse[0] + 10 + 'px')
                .style('top', mouse[1] + 20 + 'px')
                .html("<img width = 20 height = 15 src= " + country_flags.filter(({ Country }) => Country == d.properties.name)[0].Flag + ">" +
                    "<br><b>" + d.properties.name + "</b>" +
                    "<br>Departing: " + (-1*seekNum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            } else {
                tooltip_conflict_rwanda.classed('hidden', false)
                .style("opacity", 1)
                .style('left', mouse[0] + 10 + 'px')
                .style('top', mouse[1] + 20 + 'px')
                .html("<img width = 20 height = 15 src= " + country_flags.filter(({ Country }) => Country == d.properties.name)[0].Flag + ">" +
                    "<br><b>" + d.properties.name + "</b>" +
                    "<br>Rwandans Entering: " + takeNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
        })
        .on("mouseout", function (d, i) {
            tooltip_conflict_rwanda.classed('hidden', true)
                .style("opacity", 0)
            d3.select(this)
                .attr("stroke-width", 1)
                .style("stroke", "white")
                .style("fill-opacity", 1)
                .style("fill", (d) => {
                    d.Value = nc_2[d.properties.name] || 0;
                    return color_conflict_rwanda(d.Value);
                });
        })
        .style("fill", (d) => {
            d.Value = nc_2[d.properties.name] || 0;
            return color_conflict_rwanda(d.Value);
        })
        .on("click", function (d) {
            svg_rwanda.selectAll(".arcs").remove()
            d3.select(this)
            clickedCountry = d.properties.name
            if (d.Value != 0) {
                var selected_country_centroid = myProjection(d3.geoCentroid(d))

                var asylum_origin_click_xy = filter_by_Asylum_rwanda(all_asylum_data_rwanda, year, d.properties.name, d.Value);
                
                //Next two lines give the centroid of mouse over country
                //var centroid = myProjection(d3.geoCentroid(d))
                if (asylum_origin_click_xy.length != 0) {
                    makearc_rwanda(asylum_origin_click_xy, selected_country_centroid, d.Value)
                }
            }
        })
}

function rwanda_data_clean(data, year) {
    const asylum_filtered = data.filter(({ Year, Origin }) => Year == year && Origin == "Rwanda");

    var sum = 0
    asylum_filtered.forEach(function(entry) {
        sum = sum + entry.Total_In
    });

    asylum_updated = asylum_filtered.reduce(function (prev, next) {
        prev[next["Country"]] = next["Total_In"];
        return prev;
    }, {});

    asylum_updated["Rwanda"] = -sum;

    return asylum_updated
}

function makearc_rwanda(origin_xy, asylum_xy, net_movement) {
    //creating group for arcs
    var arcs = svg_rwanda.append('g')
        .attr('class', 'arcs');

    var arcdata = [];
    var length2 = Object.keys(origin_xy).length
    for (let k = 0; k < length2; k++) {
        arcdata.push({
            Origin: [origin_xy[k]],
            Country: [asylum_xy]
        })
    }

    arcs.selectAll("path")
        .data(arcdata)
        .enter()
        .append("path")
        .attr('d', function (d) {
            // console.log(d)
            return lngLatToArc(d, 'Origin', 'Country', 1, net_movement);
        })

    if (net_movement > 0) {
        arcs.selectAll("path")
            .attr('class', 'net-arrivals')
    } else {
        arcs.selectAll("path")
            .attr('class', 'net-departures')
    }

    var totalLengtharray = []
    arcs.selectAll("path").each(function (d, i) {
        totalLengtharray[i] = arcs.selectAll("path")._groups[0][i].getTotalLength();
    })
    var totalLength = Math.max(...totalLengtharray);
    arcs.selectAll("path")
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0)

};

function filter_by_Asylum_rwanda(asylum_data, year, selected_country, net_value) {
    var asylum_origin_only = {}

    if (net_value > 0) {
        asylum_origin_only = asylum_data.filter(({ Year, Country, Origin }) => Year == year && Country == selected_country && Origin == "Rwanda");
        return country_Arc_by_Movement(asylum_origin_only, "Origin")
    } else {
        asylum_origin_only = asylum_data.filter(({ Year, Origin }) => Year == year && Origin == selected_country);
        return country_Arc_by_Movement(asylum_origin_only, "Country")
    }
}