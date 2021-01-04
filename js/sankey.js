anychart.onDocumentReady(function () {
    draw_rwanda_sankey()
    draw_syria_sankey()
    draw_venezuela_sankey()
});

function draw_syria_sankey() {
    //creating the data
    var data = [
        { from: "Syria", to: "Turkey", weight: 14876251},
        { from: "Syria", to: "Egypt", weight: 776177},
        { from: "Syria", to: "Lebanon", weight: 6678622},
        { from: "Syria", to: "Jordan", weight: 4056889},
        { from: "Syria", to: "Germany", weight: 1966226 },
        { from: "Syria", to: "Iraq", weight: 1491040},
        { from: "Syria", to: "Sweden", weight: 1454457}
    ];
    //calling the Sankey function
    var sankey_chart = anychart.sankey(data);
    //customizing the width of the nodes
    sankey_chart.nodeWidth("15%");
    //customizing the curvature
    sankey_chart.curveFactor(0.2);
    //setting tooltip
    var tooltip = sankey_chart.tooltip();
    tooltip.fontFamily('Courier New');
    /*tooltip.format(function(){
        return"<span style='font-weight:bold; font-size:14pt; font-family:Courier New'>" + this.name;

    });*/
    //setting the chart title
    var title = sankey_chart.title();
    title.enabled(true);
    title.fontColor('gray');
    title.fontSize('20pt');
    title.fontFamily('Courier New')
    title.text('Where did refugees from Syria typically go?'); 
    //customizing the vertical padding of the nodes
    sankey_chart.nodePadding(30);
    //customizing the around padding of the nodes
    sankey_chart.padding(20, 80, 20, 40);
    //setting the container id
    sankey_chart.container("sankey-container-syria");
    //customizing the color palette
    sankey_chart.palette(anychart.palettes.morning);
    //initiating drawing the Sankey diagram
    sankey_chart.draw();
    //customizing label font and size
    sankey_chart.node().labels().useHtml(true);
    sankey_chart.node().labels().format(function() {
    return "<span style='font-weight:bold; font-size:14pt; font-family:Courier New'>" + this.name;
    });
    //Customizing flow font and size
    sankey_chart.flow().hovered().labels().enabled(false);
    sankey_chart.flow().tooltip().useHtml(true);
    sankey_chart.flow().tooltip().format(function() {
    return "<span style='font-size:14pt; font-family:Courier New'>"+ this.value;
    });
}

function draw_venezuela_sankey() {
    //creating the data
    var data = [
        { from: "Venezuela", to: "Colombia", weight: 1352210 },
        { from: "Venezuela", to: "Peru", weight: 729500 },
        { from: "Venezuela", to: "Chile", weight: 442110},
        { from: "Venezuela", to: "Ecuador", weight: 360996},
        { from: "Venezuela", to: "Argentina", weight: 841323},
        { from: "Venezuela", to: "Brazil", weight: 156940},
        { from: "Venezuela", to: "Panama", weight: 155787},
        { from: "Venezuela", to: "USA", weight: 210061}
    ];
    //calling the Sankey function
    var sankey_chart = anychart.sankey(data);
    //customizing the curvature
    sankey_chart.curveFactor(0.2);
    //setting tooltip
    var tooltip = sankey_chart.tooltip();
    tooltip.fontFamily('Courier New');
    //customizing the color palette
    sankey_chart.palette(anychart.palettes.glamour);
    //customizing the width of the nodes
    sankey_chart.nodeWidth("15%");
    //setting the chart title
    var title = sankey_chart.title();
    title.enabled(true);
    title.fontColor('gray');
    title.fontSize('20pt');
    title.fontFamily('Courier New')
    title.text('Where did refugees from Venezuela typically go?'); 
    //customizing the vertical padding of the nodes
    sankey_chart.nodePadding(30);
    //customizing the around padding of the nodes
    sankey_chart.padding(20, 80, 20, 40);

    //setting the container id
    sankey_chart.container("sankey-container-venezuela");
    //initiating drawing the Sankey diagram
    sankey_chart.draw();
    //customizing label font and size
    sankey_chart.node().labels().useHtml(true);
    sankey_chart.node().labels().format(function() {
    return "<span style='font-weight:bold; font-size:14pt; font-family:Courier New'>"  + this.name;
    });
    //Customizing flow font and size
    sankey_chart.flow().hovered().labels().enabled(false);
    sankey_chart.flow().tooltip().useHtml(true);
    sankey_chart.flow().tooltip().format(function() {
    return "<span style='font-size:14pt; font-family:Courier New'>"+ this.value;
    });
}

function draw_rwanda_sankey() {
    //creating the data
    var data = [
        { from: "Rwanda", to: "Dem Rep of Congo", weight: 3534598 },
        { from: "Rwanda", to: "United Rep of Tanzania", weight: 1298335},
        { from: "Rwanda", to: "Burundi", weight: 435811},
        { from: "Rwanda", to: "Uganda", weight: 254443},
        { from: "Rwanda", to: "Zambia", weight: 180593},
        { from: "Rwanda", to: "Kenya", weight: 105026 }
    ];
    //calling the Sankey function
    var sankey_chart = anychart.sankey(data);
    //customizing the width of the nodes
    sankey_chart.nodeWidth("25%");
    //customizing the curvature
    sankey_chart.curveFactor(0.2);
     //setting tooltip
    var tooltip = sankey_chart.tooltip();
    tooltip.fontFamily('Courier New');
    // sankey_chart.tooltip().format(weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g));
    //setting the chart title
    var title = sankey_chart.title();
    title.enabled(true);
    title.fontColor('gray');
    title.fontSize('20pt');
    title.fontFamily('Courier New')
    title.text('Where did refugees from Rwanda typically go?'); 
    //customizing the vertical padding of the nodes
    sankey_chart.nodePadding(30);
    //customizing the around padding of the nodes
    sankey_chart.padding(20, 80, 50, 40);
    //customizing the color palette
    sankey_chart.palette(anychart.palettes.pastel);
    //setting the container id
    sankey_chart.container("sankey-container-rwanda");
    //initiating drawing the Sankey diagram
    sankey_chart.draw();
    //customizing label font and size
    sankey_chart.node().labels().useHtml(true);
    sankey_chart.node().labels().format(function() {
    return "<span style='font-weight:bold; font-size:14pt; font-family:Courier New'>"  + this.name;
    });
    //Customizing flow font and size
    sankey_chart.flow().hovered().labels().enabled(false);
    sankey_chart.flow().tooltip().useHtml(true);
    sankey_chart.flow().tooltip().format(function() {
    return "<span style='font-size:14pt; font-family:Courier New'>"+ this.value;
    });
}