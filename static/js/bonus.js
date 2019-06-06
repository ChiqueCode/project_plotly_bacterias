function bonus(sample) {

    /**
    /* Builds gauge indicating number of belly button scrubs per week
    /* for given sample.
    /* @param {string}    sample    Name of the sample
    */
  
    // Construct url for path to data for selected sample
    var url = "/wfreq/${sample}";
  
    // Fetch sample information
    d3.json(url).then(function(sampleData){  

        // Extract washing frequency
        var wfreq = sampleData[0];

        // Converting frequency to ratio so it is equivalent to degrees for gauge 
        var level = wfreq * 180 / 9;

        // Meter point calculus
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Creating arrow for our gauge
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        // Constructing our gauge
        var data = [{ type: 'scatter',
        x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'washings',
            text: wfreq,
            hoverinfo: wfreq},
        { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3',
                    '1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:['rgb(131,181,136)', 'rgb(136,188,141)',
                        'rgb(138,192,134)','rgba(14, 127, 0, .5)', 
                        'rgba(110, 154, 22, .5)','rgba(170, 202, 42, .5)', 
                        'rgba(202, 209, 95, .5)','rgba(210, 206, 145, .5)', 
                        'rgba(232, 226, 202, .5)','rgba(255, 255, 255, 0)']},
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
        }];

        var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        title: '<b>Belly button Washing Frequency</b> <br> Scrubs per Week',
        height: 400,
        width: 400,
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };
        Plotly.newPlot("gauge", data, layout);
    });
}
