<script>
  import Plotly from 'plotly.js-dist';
  import { onMount } from 'svelte';

  export let dataPoints = [];
  export let currentSlope = 0;
  export let currentBias = 0;

  let xValues, yValues, fittedLineX, fittedLineY;
  let plotDiv;

  let layout = {
    title: 'Linear regression fit',
    xaxis: { title: 'X', autorange: false},
    yaxis: { title: 'Y', autorange: false},
    autosize: true,
    margin: {
      l: 35,
      r: 35,
      b: 35,
      t: 35,
      pad: 0
    }
  };

  $: {
    if (plotDiv) {
      xValues = dataPoints.map(point => point.x);
      yValues = dataPoints.map(point => point.y);
      fittedLineX = [0].concat(xValues);
      fittedLineY = fittedLineX.map(x => currentSlope * x + currentBias);
      updatePlot();
    }
  }

  function onDataPointsUpdate() {
    let offset = 2;
    let minX = Math.min(...dataPoints.map(point => point.x));
    let maxX = Math.max(...dataPoints.map(point => point.x));
    let minY = Math.min(...dataPoints.map(point => point.y));
    let maxY = Math.max(...dataPoints.map(point => point.y));
    layout.xaxis.range = [0, maxX + offset];
    layout.yaxis.range = [0, maxY + offset];
  }

  function updatePlot() {
    const data = [
      { x: xValues, y: yValues, mode: 'markers', type: 'scatter', name: 'Data Points' },
      { x: fittedLineX, y: fittedLineY, mode: 'lines', type: 'scatter', name: 'Fitted Line' }
    ];

    Plotly.react(plotDiv, data, layout, { responsive: true });
  }

  $: dataPoints, onDataPointsUpdate();

  onMount(() => {
    xValues = dataPoints.map(point => point.x);
    yValues = dataPoints.map(point => point.y);
    fittedLineX = [0].concat(xValues);
    fittedLineY = fittedLineX.map(x => currentSlope * x + currentBias);

    const data = [
      { x: xValues, y: yValues, mode: 'markers', type: 'scatter', name: 'Data Points' },
      { x: fittedLineX, y: fittedLineY, mode: 'lines', type: 'scatter', name: 'Fitted Line' }
    ];

    Plotly.newPlot(plotDiv, data, layout);
  });
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    background-color: white;
  }
</style>

<div bind:this={plotDiv}></div>