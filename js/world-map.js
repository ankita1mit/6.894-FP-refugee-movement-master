const svg = d3.select("#svg_map")
const myProjection = d3.geoNaturalEarth1()
const path = d3.geoPath().projection(myProjection)
const graticule = d3.geoGraticule()
const world_data_path = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
const asylum_data_path = "assets/json/refugee_processed.json"
const asylum_processed = "assets/json/refugee_summary.json"
const country_flag_path = "assets/json/countryFlagsArray.json"
var asylum_data = {}
var world_data = {}
var asylum_wrangle = {}
var clickedCountry = ""
var centroid = {};
var cntry = {};
var centroid_country = []
const colorScheme = d3.schemeRdBu[10];
const color = d3.scaleThreshold()
    .domain([-1000000, -100000, -10000, -1000, 0, 1000, 10000, 100000, 1000000])
    .range(colorScheme);

var tooltip = d3.select('#map-container').append('div')
    .attr('class', 'hidden tooltip')
    .style("opacity", 0)

d3.queue()
    .defer(d3.json, world_data_path)
    .defer(d3.json, asylum_data_path)
    .defer(d3.json, asylum_processed)
    .defer(d3.json, country_flag_path)
    .await(ready);

function ready(error, world, asylum_data_path, asylum_processed, country_flag_path) {
    if (error) throw error;

    asylum_wrangle = asylum_processed
    asylum_data = asylum_data_path
    country_flags = country_flag_path
    world_data = world

    buildLegend()

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("fill", "white");

    svg.append("path")
        .datum(graticule.outline)
        .attr("class", "foreground")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("fill", "white");

    calculateCentroids()
    updateSliderValue(1959)
}

function buildLegend() {

    //Append a defs (for definition) element to your SVG
    var defs = svg.append("defs");

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
        .data(color.range())
        .enter().append("stop")
        .attr("offset", function (d, i) { return i / (color.range().length - 1); })
        .attr("stop-color", function (d) { return d; });

    //create tick marks
    var y = d3.scaleLinear()
        .domain([1000000, -1000000])
        .range([0, 300])

    var tick_numbers = [+1000000, +750000, +500000, +250000, 0, -250000, -500000, -750000, -1000000]

    var yAxis = d3.axisRight(y)
        .tickValues(tick_numbers)
        .tickFormat(d => {
            if (d == -1000000) {
                return "<-1,000,000"
            }

            if (d == 1000000) {
                return ">+1,000,000"
            }

            if (d > 0) {
                return "+" + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }

            return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        })
    // .tickFormat(d3.format("+20"))
    // .tickValues();
    // .tickArguments([+10000, +5000, +1000, 0, -1000, -5000, -10000]);

    svg.append('g')
        .attr("class", "y axis")
        .attr("transform", "translate(60,90)")
        .attr("width", 20)
        .call(yAxis)

    //Draw the rectangle and fill with gradient
    svg.append("rect")
        .attr("width", 10)
        .attr("height", 300)
        .style("fill", "url(#linear-gradient)")
        .attr("transform", "translate(50, 90)");

    svg.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", 150)
        .text("Net Refugee Movement")
        .attr("dx", "-345")
        .attr("dy", "-110")
        .attr("transform", "rotate(-90)");
}

function calculateCentroids() {
    //Calculating Centroid for all countries
    var i = 0;
    const country_new = topojson.feature(world_data, world_data.objects.countries);

    country_new.features.forEach(d => {

        centroid[i] = myProjection(d3.geoCentroid(d));
        cntry[i] = d.properties.name;
        centroid_country[i] = { name: cntry[i], centroid: centroid[i] }
        i++;
    })
}

function updateSliderValue(year) {

    net_calculation = update_asylum(asylum_wrangle, year, "Country", "Net")
    asylum_seek_by_country = update_asylum(asylum_wrangle, year, "Country", "Departures")
    asylum_take_by_country = update_asylum(asylum_wrangle, year, "Country", "Arrivals")

    svg.selectAll("path").remove()

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(world_data, world_data.objects.countries).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "geoPath")
        .on("mouseover", function (d, i) {
            d3.select(this)
                .attr("stroke-width", 3)
                //.style("stroke", "grey")
                .style("fill", "grey");
        })
        .on('mousemove', function (d) {
            d3.select(this)
            var seekNum = asylum_seek_by_country[d.properties.name] || 0
            var takeNum = asylum_take_by_country[d.properties.name] || 0
            var mouse = d3.mouse(svg.node()).map(function (d) {
                return parseInt(d);
            })

            tooltip.classed('hidden', false)
                .style("opacity", 1)
                // .style('left', ((mouse[0] + 250)/17) + '%')
                // .style('top', ((mouse[1] + 200)/12) + '%')
                .style('left', mouse[0] + 10 + 'px')
                .style('top', mouse[1] + 20 + 'px')
                // .style('position', 'relative')
                .html("<img width = 20 height = 15 src= " + country_flags.filter(({ Country }) => Country == d.properties.name)[0].Flag + ">" +
                    "<br><b>" + d.properties.name + "</b>" +
                    "<br>Departing: " + seekNum +
                    "<br>Entering: " + takeNum);
        })
        .on("mouseout", function (d, i) {
            tooltip.classed('hidden', true)
                .style("opacity", 0)
            d3.select(this)
                .attr("stroke-width", 1)
                .style("stroke", "white")
                .style("fill-opacity", 1)
                .style("fill", (d) => {
                    d.Value = net_calculation[d.properties.name] || 0;
                    return color(d.Value);
                });
        })
        .style("fill", (d) => {
            d.Value = net_calculation[d.properties.name] || 0;
            return color(d.Value);
        })
        .on("click", function (d) {
            svg.selectAll(".arcs").remove()
            d3.select(this)
            clickedCountry = d.properties.name
            
            if (d.Value != 0) {
                var selected_country_centroid = myProjection(d3.geoCentroid(d))

                var asylum_origin_click_xy = filter_by_Asylum(asylum_data, year, d.properties.name, d.Value);
                //Next two lines give the centroid of mouse over country
                //var centroid = myProjection(d3.geoCentroid(d))
                if (asylum_origin_click_xy.length != 0) {
                    makearc(asylum_origin_click_xy, selected_country_centroid, d.Value)
                } else {
                    var snack = document.getElementById("snackbar")
                    snack.innerHTML = `Refugee origins are unknown for ${clickedCountry} in ${year}.`;
                    snack.className = "show";

                    // After 3 seconds, remove the show class from DIV
                    setTimeout(function () { snack.className = snack.className.replace("show", ""); }, 3000);
                }
            }
        })
}


function update_asylum(asylum_data, year, type, attr) {

    const asylum_filtered = asylum_data.filter(({ Year }) => Year == year);
    asylum_updated = asylum_filtered.reduce(function (prev, next) {
        prev[next[type]] = next[attr];
        return prev;
    }, {});
    return asylum_updated
}

function filter_by_Asylum(asylum_data, year, selected_country, net_value) {
    var asylum_origin_only = {}
    
    if (net_value > 0) {
        asylum_origin_only = asylum_data.filter(({ Year, Country }) => Year == year && Country == selected_country);
        return country_Arc_by_Movement(asylum_origin_only, "Origin")
    } else {
        asylum_origin_only = asylum_data.filter(({ Year, Origin }) => Year == year && Origin == selected_country);
        return country_Arc_by_Movement(asylum_origin_only, "Country")
    }
}

function country_Arc_by_Movement(asylum_d, country_type) {
    var asy_origin_centr = []

    asylum_d.forEach((data) => {
        new_obj = centroid_country.find(({ name }) => name == data[country_type])
        if (new_obj != undefined) {
            asy_origin_centr.push(new_obj.centroid)
        }
    })
    return asy_origin_centr
}

function get_total_country_asylum_data(asylum_data, selectedCountryName, type, attr) {
    const asylum_filtered = asylum_data.filter(({ Country }) => Country == selectedCountryName)
    asylum_updated = asylum_filtered.reduce(function (prev, next) {
        prev[next[type]] = next[attr]
        return prev;
    }, {});
    return asylum_updated
}

// Create a path for each source/target pair.
function makearc(origin_xy, asylum_xy, net_movement) {

    //creating group for arcs
    var arcs = svg.append('g')
        .attr('class', 'arcs');

    var arcdata = [];
    var length2 = Object.keys(origin_xy).length
    for (let k = 0; k < length2; k++) {
        arcdata.push({
            Origin: [origin_xy[k]],
            Asylum: [asylum_xy]
        })

    }

    arcs.selectAll("path")
        .data(arcdata)
        .enter()
        .append("path")
        .attr('d', function (d) {

            return lngLatToArc(d, 'Origin', 'Asylum', 1, net_movement);

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

//Source : http://bl.ocks.org/mhkeller/f41cceac3e7ed969eaeb
// This function takes an object, the key names where it will find an array of lng/lat pairs, e.g. `[-74, 40]`
// And a bend parameter for how much bend you want in your arcs, the higher the number, the less bend.
function lngLatToArc(d, originName, asylumName, bend, net_movement) {

    // If no bend is supplied, then do the plain square root
    bend = bend || 1;
    // `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
    // Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`
    ;
    var originXY = d[originName],
        asylumXY = d[asylumName];

    if (originXY && asylumXY) {

        //console.log(sourceXY, targetXY);
        // Uncomment this for testing, useful to see if you have any null lng/lat values
        // if (!targetXY) console.log(d, targetLngLat, targetXY)
        var originX = originXY[0][0],
            originY = originXY[0][1];

        var asylumX = asylumXY[0][0],
            asylumY = asylumXY[0][1];

        var dx = asylumX - originX,
            dy = asylumY - originY,
            dr = Math.sqrt(dx * dx + dy * dy) * bend;

        // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
        // var west_of_source = (asylumX - originX) < 0;
        // if (west_of_source) 
        if (net_movement > 0) {
            return "M" + originX + "," + originY + "A" + dr + "," + dr + " 0 0,1 " + asylumX + "," + asylumY;
        } else {
            return "M" + asylumX + "," + asylumY + "A" + dr + "," + dr + " 0 0,1 " + originX + "," + originY;
        }



    } else {
        return "M0,0,l0,0z";
    }
}

/* Useful Resources:
Random Tour of Globe example - http://bl.ocks.org/espinielli/5107491
Flag and additional bar chart - https://www.knime.com/blog/JS_WorldCup

*/