const svg_conflict = d3.select("#svg_map_conflict")
const asylum_syria_data = "assets/json/refugee_summary.json"
const asylum_data_all = "assets/json/refugee_processed.json"
var syria_processed = {}
var all_asylum_data = {}
var world_map_syria = {}
const colorScheme_conflict = d3.schemeRdBu[10];
const color_conflict = d3.scaleThreshold()
    .domain([-500000, -50000, -5000, 500, 0, 500, 5000, 50000, 500000])
    .range(colorScheme_conflict);
var centroid_conflict = {};
var cntry = {};
var centroid_country_conflict = []

var tooltip_conflict = d3.select('#conflict-map-container').append('div')
    .attr('class', 'hidden tooltip')
    .style("opacity", 0)

d3.queue()
    .defer(d3.json, asylum_syria_data)
    .defer(d3.json, asylum_data_all)
    .defer(d3.json, world_data_path)
    .await(ready_conflict);

function ready_conflict(error, asylum_syria, asylum_data, world_info) {
    if (error) throw error;

    syria_processed = asylum_syria
    all_asylum_data = asylum_data
    world_map_syria = world_info

    buildLegend_conflict()

    svg_conflict.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("fill", "white");

    svg_conflict.append("path")
        .datum(graticule.outline)
        .attr("class", "foreground")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("fill", "white");

    updateSliderValue_conflict(2011)
}

function buildLegend_conflict() {

    //Append a defs (for definition) element to your SVG
    var defs = svg_conflict.append("defs");

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
        .data(color_conflict.range())
        .enter().append("stop")
        .attr("offset", function(d, i) { return i / (color.range().length - 1); })
        .attr("stop-color", function(d) { return d; });

    //create tick marks
    var y = d3.scaleLinear()
        .domain([500000, -500000])
        .range([0, 300])

    var tick_numbers = [+500000, +250000, +100000, 0, -100000, -250000, -500000]

    var yAxis = d3.axisRight(y)
        .tickValues(tick_numbers)
        .tickFormat(d => {
            if (d == -500000) {
                return "<-500,000"
            }

            if (d == 500000) {
                return ">+500,000"
            }

            if (d > 0) {
                return "+" + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }

            return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        })
        // .tickFormat(d3.format("+20"))
        // .tickValues();
        // .tickArguments([+10000, +5000, +1000, 0, -1000, -5000, -10000]);

    svg_conflict.append('g')
        .attr("class", "y axis")
        .attr("transform", "translate(60,90)")
        .attr("width", 20)
        .call(yAxis)

    //Draw the rectangle and fill with gradient
    svg_conflict.append("rect")
        .attr("width", 10)
        .attr("height", 300)
        .style("fill", "url(#linear-gradient)")
        .attr("transform", "translate(50, 90)");

    svg_conflict.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", 150)
        .text("Syrian Refugee Movement")
        .attr("dx", "-345")
        .attr("dy", "-110")
        .attr("transform", "rotate(-90)");
}

function updateSliderValue_conflict(year) {
    nc_2 = conflict_data_clean(all_asylum_data, year)

    svg_conflict.selectAll("path").remove()

    svg_conflict.append("g")
        .selectAll("path")
        .data(topojson.feature(world_map_syria, world_map_syria.objects.countries).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "geoPath")
        .on("mouseover", function(d, i) {
            d3.select(this)
                .attr("stroke-width", 3)
                //.style("stroke", "grey")
                .style("fill", "grey");
        })
        .on('mousemove', function(d) {
            d3.select(this)
            var seekNum = nc_2[d.properties.name] || 0
            var takeNum = nc_2[d.properties.name] || 0
            var mouse = d3.mouse(svg_conflict.node()).map(function(d) {
                return parseInt(d);
            })

            if (d.properties.name == "Syria") {
                tooltip_conflict.classed('hidden', false)
                    .style("opacity", 1)
                    .style('left', mouse[0] + 10 + 'px')
                    .style('top', mouse[1] + 20 + 'px')
                    .html("<img width = 20 height = 15 src= " + country_flags.filter(({ Country }) => Country == d.properties.name)[0].Flag + ">" +
                        "<br><b>" + d.properties.name + "</b>" +
                        "<br>Departing: " + (-1 * seekNum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            } else {
                tooltip_conflict.classed('hidden', false)
                    .style("opacity", 1)
                    .style('left', mouse[0] + 10 + 'px')
                    .style('top', mouse[1] + 20 + 'px')
                    .html("<img width = 20 height = 15 src= " + country_flags.filter(({ Country }) => Country == d.properties.name)[0].Flag + ">" +
                        "<br><b>" + d.properties.name + "</b>" +
                        "<br>Syrians Entering: " + takeNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
        })
        .on("mouseout", function(d, i) {
            tooltip_conflict.classed('hidden', true)
                .style("opacity", 0)
            d3.select(this)
                .attr("stroke-width", 1)
                .style("stroke", "white")
                .style("fill-opacity", 1)
                .style("fill", (d) => {
                    d.Value = nc_2[d.properties.name] || 0;
                    return color_conflict(d.Value);
                });
        })
        .style("fill", (d) => {
            d.Value = nc_2[d.properties.name] || 0;
            return color_conflict(d.Value);
        })
        .on("click", function(d) {
            svg_conflict.selectAll(".arcs").remove()
            d3.select(this)
            clickedCountry = d.properties.name
            if (d.Value != 0) {
                var selected_country_centroid = myProjection(d3.geoCentroid(d))

                var asylum_origin_click_xy = filter_by_Asylum_conflict(all_asylum_data, year, d.properties.name, d.Value);
                //Next two lines give the centroid of mouse over country
                //var centroid = myProjection(d3.geoCentroid(d))
                if (asylum_origin_click_xy.length != 0) {
                    makearc_conflict(asylum_origin_click_xy, selected_country_centroid, d.Value)
                }
            }
        })
}

function conflict_data_clean(data, year) {
    const asylum_filtered = data.filter(({ Year, Origin }) => Year == year && Origin == "Syria");

    var sum = 0
    asylum_filtered.forEach(function(entry) {
        sum = sum + entry.Total_In
    });

    asylum_updated = asylum_filtered.reduce(function(prev, next) {
        prev[next["Country"]] = next["Total_In"];
        return prev;
    }, {});

    asylum_updated["Syria"] = -sum;

    return asylum_updated
}

function makearc_conflict(origin_xy, asylum_xy, net_movement) {
    //creating group for arcs
    var arcs = svg_conflict.append('g')
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
        .attr('d', function(d) {
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
    arcs.selectAll("path").each(function(d, i) {
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

function filter_by_Asylum_conflict(asylum_data, year, selected_country, net_value) {
    var asylum_origin_only = {}

    if (net_value > 0) {
        asylum_origin_only = asylum_data.filter(({ Year, Country, Origin }) => Year == year && Country == selected_country && Origin == "Syria");
        return country_Arc_by_Movement(asylum_origin_only, "Origin")
    } else {
        asylum_origin_only = asylum_data.filter(({ Year, Origin }) => Year == year && Origin == selected_country);
        return country_Arc_by_Movement(asylum_origin_only, "Country")
    }
}