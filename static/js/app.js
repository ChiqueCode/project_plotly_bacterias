function buildMetadata(sample) {
  var metadata_url = `/metadata/${sample}`;

  //Use `d3.json` to fetch the metadata for a sample
  d3.json(metadata_url).then(function(metadata_response) {
    console.log(metadata_response);

    // Use d3 to select the panel with id of `#sample-metadata`
    // now sampleMetadata is my panel?
    var sampleMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // //Use `Object.entries` to add each key and value pair to the panel
    // entries(metadata_response) -> passig the data that we got from the route
    // append a paragraph in the panel to store key,values
    Object.entries(metadata_response).forEach(([key, value]) => {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  // Use `d3.json` to fetch the sample data for the plots
  var sample_url = `/samples/${sample}`;

  d3.json(sample_url).then(function(sample_data) {
   // console.log(sample_data);

    // Plotting Bar Chart (attempt)
    // sort the data in descending order
    const sortedData = sample_data.sample_values.sort(function(a, b) {
      return parseFloat(b) - parseFloat(a);
    });

    // slice the first 10 values
    const dataSliced = sortedData.slice(0, 10);
    //console.log(dataSliced);
    const idsSliced = sample_data["otu_ids"].slice(0, 10);
    // console.log(idsSliced);

    // var data = [
    //   {
    //     x: idsSliced,
    //     y: dataSliced,
    //     type: 'bar'
    //   }
    // ];
  
    // Plotly.newPlot('bar', data);

  // Pie Chart
  var trace_pie = {
    values: sample_data.sample_values.slice(0,10),
    labels: sample_data.otu_ids.slice(0,10),
    hovertext: sample_data.otu_labels.slice(0,10),
    type: 'pie'
  }
  var pie_data = [trace_pie];
  var layout_pie = {
    title: "Bacteria Pie Chart",
  };
  Plotly.plot("bar",pie_data,layout_pie);

  // Plotting bubbleChart
    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "otu_id" }
    };
    var bubbleData = [
      {
        x: sample_data["otu_ids"],
        y: sample_data["sample_values"],
        text: sample_data["otu_labels"],
        mode: "markers",
        marker: {
          size: sample_data["sample_values"],
          color: sample_data["otu_ids"],
          colorscale: "Earth"
        }
      }
    ];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });
}

function bonus(sample) {

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
      showlegend: true
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

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  // sampleNames is the list of sample names coming from /names route, using selector add sample text and property(value of a sample)
  d3.json("/names").then(sampleNames => {
    sampleNames.forEach(sample => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    bonus(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  bonus(newSample);
}

// Initialize the dashboard
init();
