<script>
  import LoadingBar from './components/LoadingBar.svelte';
  import DataPlot from './components/DataPlot.svelte';
  import LossPlot from './components/LossPlot.svelte';
  import LearningPlot from './components/LearningPlot.svelte';
  import { optimize, precomputeLoss } from './utils.js';
  import { loadDataset, DatasetType } from './data.js';
  import { onMount } from 'svelte';

  let isAnimating = false;
  let progress = 0;
  let currentLoss = 0;
  let currentSlope = 0;
  let currentBias = 0;
  let currentEpoch = 0;
  let epochs = 60;
  let tickPrecision = 10;
  let learningRate = 0.001;
  let datasetType = DatasetType.RANDOM;
  let dataPoints = [];
  let useBias = true;
  let showHeatmap = false;
  let lossData = [];
  let params = [];
  let losses = [];

  function updateParams(){
    [params, losses] = optimize(dataPoints, epochs, learningRate, useBias);
  }

  function updateRegressionData(){
    updateParams();

    const offset = 20;
    const precision = 1;

    if (useBias) {
      const slopes = params.map(p => p.slope);
      const biases = params.map(p => p.bias);
      const minSlope = Math.min(...slopes);
      const maxSlope = Math.max(...slopes);
      const minBias = Math.min(...biases);
      const maxBias = Math.max(...biases);
      lossData = precomputeLoss(minSlope - offset, maxSlope + offset, precision, dataPoints, useBias, minBias - offset, maxBias + offset);
    } else {
      const minSlope = Math.min(...params);
      const maxSlope = Math.max(...params);
      lossData = precomputeLoss(minSlope - offset, maxSlope + offset, precision, dataPoints, useBias);
    }
  }

  async function updateDataPoints() {
    dataPoints = await loadDataset(datasetType);
    updateRegressionData();
  }

  const toggleAnimation = () => {
    if (isAnimating) {
      isAnimating = false; // Stop the animation
    } else {
      isAnimating = true; // Resume the animation
      startAnimation(); // Start animation if it was paused
    }
  };

  const resetAnimation = () => {
    stopAnimation(); // Stop any ongoing animation
    progress = 0; // Reset progress
    currentLoss = 0; // Reset current loss
    currentSlope = 0; // Reset current slope
    currentBias = 0; // Reset current bias
    currentEpoch = 0; // Reset current epoch
  };

  $: datasetType, updateDataPoints();
  $: useBias, updateRegressionData();
  $: epochs, updateParams();
  $: learningRate, updateParams();

  const startAnimation = () => {
    isAnimating = true;
    progress = 0;

    const animate = () => {
      if (currentEpoch < epochs && isAnimating) {
        if (useBias) {
          currentSlope = params[currentEpoch].slope;
          currentBias = params[currentEpoch].bias;
        } else {
          currentSlope = params[currentEpoch];
        }
        currentLoss = losses[currentEpoch];
        progress = ((currentEpoch + 1) / epochs) * 100;
        currentEpoch++;
        requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    };

    requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    isAnimating = false;
  };

  onMount(() => {
    updateDataPoints(); // Call updateDataPoints when the component is mounted
  });
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
    font-family: 'Roboto', sans-serif;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 60% 40%;
    gap: 20px;
    padding: 20px;
    height: 100vh;
    box-sizing: border-box;
  }

  .grid-item {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .controls-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 0.9em;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .control-group label {
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  .control-group input[type="number"] {
    width: 80px;
    padding: 4px;
  }

  .control-group select {
    padding: 4px;
  }

  .loading-section {
    margin-top: auto;
    padding: 8px 0;
  }

  .loading-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }

  .loading-controls button {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    background-color: #2c3e50;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .progress-text {
    font-size: 0.9em;
    color: #666;
    margin-left: auto;
  }

  .empty-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
    font-style: italic;
    color: #6c757d;
  }
</style>

<main>
  <div class="grid-container">
    <div class="grid-item">
      <DataPlot {dataPoints} {currentSlope} {currentBias} />
    </div>
    
    <div class="grid-item">
      <LossPlot {lossData} {currentSlope} {currentLoss} {currentBias} {useBias} {showHeatmap}/>
    </div>
    
    <div class="grid-item controls-container">
      <div class="control-group">
        <label>
          Dataset:
          <select bind:value={datasetType}>
            <option value={DatasetType.RANDOM}>Random</option>
            <option value={DatasetType.BOSTON}>Boston</option>
            <option value={DatasetType.SCORES}>Student scores</option>
          </select>
        </label>
      </div>
      
      <div class="control-group">
        <label>
          Max Epoch:
          <input type="number" bind:value={epochs} min="20" />
        </label>
        <label>
          Learning Rate:
          <input type="number" bind:value={learningRate} min="0.0001" max="0.01" step="0.001" />
        </label>
      </div>
      
      <div class="control-group">
        <label>
          Use Bias:
          <input type="checkbox" bind:checked={useBias} />
        </label>
        <label>
          Heat map view:
          <input type="checkbox" bind:checked={showHeatmap} />
        </label>
      </div>

      <div class="loading-section">
        <div class="loading-controls">
          <button on:click={toggleAnimation}>{isAnimating ? 'Stop' : 'Start'}</button>
          <button on:click={resetAnimation}>Reset</button>
          <span class="progress-text">Epoch: {currentEpoch}/{epochs}</span>
        </div>
        <LoadingBar {progress} {tickPrecision} {epochs} />
      </div>
    </div>
    
    <div class="grid-item">
      <LearningPlot {losses} {currentEpoch}/>
    </div>
  </div>
</main>
