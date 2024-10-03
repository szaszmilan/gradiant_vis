<script>
  import Plotly from 'plotly.js-dist';
  import { onMount } from 'svelte';

  export let lossData = [];
  export let currentLoss = 0;
  export let currentSlope = 0;
  export let currentBias = 0;
  export let useBias = true;

  let lossPlotDiv;

  const layout = {
    title: 'Loss plot',
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

  function updateLossPlot(currentLoss, currentSlope, currentBias) {
    if (lossData.length === 0) return; // Check if lossData is populated

    const [ points, losses, triangles ] = lossData;

    const x = points.map(p => p[0]);
    const y = losses;
    const z = points.map(p => p[1]);

    const i = [];
    const j = [];
    const k = [];

    for (let t = 0; t < triangles.length; t += 3) {
      i.push(triangles[t]);
      j.push(triangles[t + 1]);
      k.push(triangles[t + 2]);
    }

    let data;
    if (useBias) {
      data = [
        { x, y, z, i, j, k, type: 'mesh3d', opacity: 0.5, name: 'Loss Plane' },
        { x: [currentSlope], y: [currentLoss], z: [currentBias], mode: 'markers', type: 'scatter3d', marker: { color: 'red', size: 10 }, name: 'Current Loss' }
      ];
    } else {
      data = [
        { x, y, mode: 'lines', type: 'scatter', name: 'Loss Function' },
        { x: [currentSlope], y: [currentLoss], mode: 'markers', type: 'scatter', marker: { color: 'red', size: 10 }, name: 'Current Loss' }
      ];
    }

    const layout3d = {
      ...layout,
      scene: {
        camera: {
          eye: { x: 3.99816983379437e-18, y: 1.5903603670363204e-16, z: -2.5980762113533165 }
        },
        xaxis: { title: 'Slope' },
        yaxis: { title: 'Loss' },
        zaxis: { title: 'Bias' }
      }
    };

    Plotly.react(lossPlotDiv, data, useBias ? layout3d : layout, { responsive: true });
  }

  $: {
    if (lossPlotDiv && lossData.length > 0) {
      updateLossPlot(currentLoss, currentSlope, currentBias);
    }
  }

  onMount(() => {
    if (lossData.length > 0) {
      updateLossPlot(currentLoss, currentSlope, currentBias);
    }
  });
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    background-color: white;
  }
</style>

<div bind:this={lossPlotDiv}></div>