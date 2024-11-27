<script>
    import Plotly from 'plotly.js-dist';
    import { onMount } from 'svelte';
  
    export let losses = [];
    export let currentEpoch = 0;
  
    let plotDiv;
  
    const layout = {
      title: 'Loss over epochs',
      xaxis: { title: 'Epoch' },
      yaxis: { title: 'Loss' },
      autosize: true,
      uirevision: 'true',
      margin: {
        l: 35,
        r: 35,
        b: 35,
        t: 35,
        pad: 0
      }
    };
  
    function updatePlot() {
      if (!plotDiv || losses.length === 0) return;
  
      const epochs = Array.from({ length: losses.length }, (_, i) => i);
      
      const data = [
        {
          x: epochs,
          y: losses,
          mode: 'lines',
          type: 'scatter',
          name: 'Loss'
        },
        {
          x: [currentEpoch],
          y: [losses[currentEpoch]],
          mode: 'markers',
          type: 'scatter',
          marker: { color: 'red', size: 10 },
          name: 'Current Epoch'
        }
      ];
  
      Plotly.react(plotDiv, data, layout, { responsive: true });
    }

    $: currentEpoch, updatePlot();
  
    onMount(() => {
      if (losses.length > 0) {
        updatePlot();
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
  
  <div bind:this={plotDiv}></div>