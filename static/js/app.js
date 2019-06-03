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


    // Plotting Bar Chart
    // sort the data in descending order
    const sortedData = sample_data.sample_values.sort(function(a, b) {
      return parseFloat(b) - parseFloat(a);
    });

    // slice the first 10 values
    const dataSliced = sortedData.slice(0, 10);
    //console.log(dataSliced);
    const idsSliced = sample_data["otu_ids"].slice(0, 10);
    // console.log(idsSliced);

    var data = [
      {
        x: idsSliced,
        y: dataSliced,
        type: 'bar'
      }
    ];
  
    Plotly.newPlot('bar', data);

  // Pie Chart
  // var trace_pie = {
  //   values: sample_data.sample_values.slice(0,10),
  //   labels: sample_data.otu_ids.slice(0,10),
  //   hovertext: sample_data.otu_labels.slice(0,10),
  //   type: 'pie'
  // }
  // var pie_data = [trace_pie];
  // var layout_pie = {
  //   title: "Bacteria Pie Chart",
  // };
  // Plotly.plot("bar",pie_data,layout_pie);

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
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
