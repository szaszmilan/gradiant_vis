<script>
  import Plotly from 'plotly.js-dist';
  import { onMount } from 'svelte';

  export let dataPoints = [];
  export let currentSlope = 0;
  export let currentBias = 0;

  let xValues, yValues, fittedLineY;

  let plotDiv;

  const layout = {
    title: 'Linear regression fit',
    xaxis: { title: 'X' },
    yaxis: { title: 'Y' },
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
      fittedLineY = xValues.map(x => currentSlope * x + currentBias);
      updatePlot();
    }
  }

  function updatePlot() {
    const data = [
      { x: xValues, y: yValues, mode: 'markers', type: 'scatter', name: 'Data Points' },
      { x: xValues, y: fittedLineY, mode: 'lines', type: 'scatter', name: 'Fitted Line' }
    ];

    Plotly.react(plotDiv, data, layout, { responsive: true });
  }

  onMount(() => {
    xValues = dataPoints.map(point => point.x);
    yValues = dataPoints.map(point => point.y);
    fittedLineY = xValues.map(x => currentSlope * x + currentBias);

    const data = [
      { x: xValues, y: yValues, mode: 'markers', type: 'scatter', name: 'Data Points' },
      { x: xValues, y: fittedLineY, mode: 'lines', type: 'scatter', name: 'Fitted Line' }
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