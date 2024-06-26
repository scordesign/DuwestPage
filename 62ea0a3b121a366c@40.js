// https://observablehq.com/@john-guerra/geojson-colombia@40
function _1(md){return(
md
)}

function _map(d3,colombiaGeoJSON)
{
  const svg = d3.create("svg");

  var width = 960,
      height = 600,
      centered;

  // Define color scale
  var color = d3.scaleLinear()
  .domain([1, 20])
  .clamp(true)
  .range(['#fff', '#409A99']);

  var projection = d3.geoMercator()
  .scale(2000)
  // Center the Map in Colombia
  .center([-74, 4.5])
  .translate([width / 2, height / 2]);

  var path = d3.geoPath()
  .projection(projection);

  // Set svg width & height
  svg
    .attr('width', width)
    .attr('height', height);

  // Add background
  svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)
    .on('click', clicked);

  var g = svg.append('g');

  var effectLayer = g.append('g')
    .classed('effect-layer', true);

  var mapLayer = g.append('g')
    .classed('map-layer', true);

  // var dummyText = g.append('text')
  //   .classed('dummy-text', true)
  //   .attr('x', 10)
  //   .attr('y', 30)
  //   .style('opacity', 0);

  var bigText = g.append('text')
    .classed('big-text', true)
    .attr('x', 20)
    .attr('y', 45);


  // Get province name
  function nameFn(d){
    return d && d.properties ? d.properties.NOMBRE_DPT : null;
  }

  // Get province name length
  function nameLength(d){
    var n = nameFn(d);
    return n ? n.length : 0;
  }

  // Get province color
  function fillFn(d){
    return color(nameLength(d));
  }

  // When clicked, zoom in
  function clicked(d) {
    var x, y, k;
    // Get information about the clicked department from its properties
  const departmentInfo = d.properties;  // Assuming department information is in properties

  // Update a DOM element (outside this function) to display the information
  document.getElementById('department-info').innerHTML = `
    <h2>Selected Department: ${departmentInfo.NOMBRE_DPT}</h2>
    `;
}

    // Compute centroid of the selected path
    if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4; 
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    // Highlight the clicked province
    mapLayer.selectAll('path')
      .style('fill', function(d){return centered && d===centered ? '#008F39' : fillFn(d);});

    // Zoom
   // g.transition()
     // .duration(750)
      //.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
  }

  function mouseover(d){
    // Highlight hovered province
    d3.select(this).style('fill', 'green');

    // Draw effects
    textArt(nameFn(d));
  }

  function mouseout(d){
    // Reset province color
    mapLayer.selectAll('path')
      .style('fill', function(d){return centered && d===centered ? '#008F39' : fillFn(d);});

    // Remove effect text
    effectLayer.selectAll('text').transition()
      .style('opacity', 0)
      .remove();

    // Clear province name
    bigText.text('');
  }

  // Gimmick
  // Just me playing around.
  // You won't need this for a regular map.

  var BASE_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

  var FONTS = [
    "Open Sans",
    "Josefin Slab",
    "Arvo",
    "Lato",
    "Vollkorn",
    "Abril Fatface",
    "Old StandardTT",
    "Droid+Sans",
    "Lobster",
    "Inconsolata",
    "Montserrat",
    "Playfair Display",
    "Karla",
    "Alegreya",
    "Libre Baskerville",
    "Merriweather",
    "Lora",
    "Archivo Narrow",
    "Neuton",
    "Signika",
    "Questrial",
    "Fjalla One",
    "Bitter",
    "Varela Round"
  ];

  function textArt(text){
    // Use random font
    var fontIndex = Math.round(Math.random() * FONTS.length);
    var fontFamily = FONTS[fontIndex] + ', ' + BASE_FONT;

    bigText
      .style('font-family', fontFamily)
      .text(text);

    // Use dummy text to compute actual width of the text
    // getBBox() will return bounding box
    dummyText
      .style('font-family', fontFamily)
      .text(text);
    var bbox = dummyText.node().getBBox();

    var textWidth = bbox.width;
    var textHeight = bbox.height;
    var xGap = 3;
    var yGap = 1;

    // Generate the positions of the text in the background
    var xPtr = 0;
    var yPtr = 0;
    var positions = [];
    var rowCount = 0;
    while(yPtr < height){
      while(xPtr < width){
        var point = {
          text: text,
          index: positions.length,
          x: xPtr,
          y: yPtr
        };
        var dx = point.x - width/2 + textWidth/2;
        var dy = point.y - height/2;
        point.distance = dx*dx + dy*dy;

        positions.push(point);
        xPtr += textWidth + xGap;
      }
      rowCount++;
      xPtr = rowCount%2===0 ? 0 : -textWidth/2;
      xPtr += Math.random() * 10;
      yPtr += textHeight + yGap;
    }

    var selection = effectLayer.selectAll('text')
    .data(positions, function(d){return d.text+'/'+d.index;});

    // Clear old ones
    selection.exit().transition()
      .style('opacity', 0)
      .remove();

    // Create text but set opacity to 0
    const textEnter = selection.enter().append('text')
      .text(function(d){return d.text;})
      .attr('x', function(d){return d.x;})
      .attr('y', function(d){return d.y;})
      .style('font-family', fontFamily)
      .style('fill', '#777')
      .style('opacity', 0);

    selection.merge(textEnter)
      .style('font-family', fontFamily)
      .attr('x', function(d){return d.x;})
      .attr('y', function(d){return d.y;});

    // Create transtion to increase opacity from 0 to 0.1-0.5
    // Add delay based on distance from the center of the <svg> and a bit more randomness.
    selection.merge(textEnter).transition()
      .delay(function(d){
      return d.distance * 0.01 + Math.random()*1000;
    })
      .style('opacity', function(d){
      return 0.1 + Math.random()*0.4;
    });
  }
  
    var features = colombiaGeoJSON.features;

  // Update color scale domain based on data
  color.domain([0, d3.max(features, nameLength)]);

  // Draw each province as a path
  mapLayer.selectAll('path')
    .data(features)
    .enter().append('path')
    .attr('d', path)
    .attr('vector-effect', 'non-scaling-stroke')
    .style('fill', fillFn)
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)
    .on('click', clicked);

  return svg.node()
}


function _colombiaGeoJSON(d3){return(
d3.json("https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/3aadedf47badbdac823b00dbe259f6bc6d9e1899/colombia.geo.json")
)}

function _4(html){return(
html`<style>

@import url(https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300|Josefin+Slab|Arvo|Lato|Vollkorn|Abril+Fatface|Old+Standard+TT|Droid+Sans|Lobster|Inconsolata|Montserrat|Playfair+Display|Karla|Alegreya|Libre+Baskerville|Merriweather|Lora|Archivo+Narrow|Neuton|Signika|Questrial|Fjalla+One|Bitter|Varela+Round);

.background {
  fill: transparent;
  pointer-events: all;
}

.map-layer {
  fill: #fff;
  stroke: #aaa;
}

.effect-layer{
  pointer-events:none;
}

text{
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 300;
}

text.big-text{
  font-size: 30px;
  font-weight: 400;
}

.effect-layer text, text.dummy-text{
  font-size: 12px;
}

</style>`
)}

function _d3(require){return(
require("d3@5")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("map")).define("map", ["d3","colombiaGeoJSON"], _map);
  main.variable(observer("colombiaGeoJSON")).define("colombiaGeoJSON", ["d3"], _colombiaGeoJSON);
  main.variable(observer()).define(["html"], _4);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
