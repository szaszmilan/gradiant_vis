<script>
  import LoadingBar from './components/LoadingBar.svelte';
  import DataPlot from './components/DataPlot.svelte';
  import LossPlot from './components/LossPlot.svelte';
  import { optimize, precomputeLoss } from './utils.js';
  import { loadDataset, DatasetType } from './data.js';

  let isAnimating = false;
  let progress = 0;
  let currentLoss = 0;
  let currentSlope = 0;
  let currentBias = 0;
  let epochs = 60;
  let tickPrecision = 10;
  let learningRate = 0.001;
  let datasetType = DatasetType.RANDOM;
  let dataPoints = [];
  let useBias = true;
  let lossData = [];
  let params = [];
  let losses = [];

  function updateRegressionData(){
    lossData = precomputeLoss(-5, 5, 0.1, dataPoints, useBias);
    [params, losses] = optimize(dataPoints, epochs, learningRate, useBias);
  }

  async function updateDataPoints() {
    dataPoints = await loadDataset(datasetType);
    updateRegressionData();
  }


  $: datasetType, updateDataPoints();
  $: useBias, updateRegressionData();

  const startAnimation = () => {
    isAnimating = true;
    let currentEpoch = 0;
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
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
    font-family: 'Roboto', sans-serif;
  }

  .menu-bar {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #2c3e50;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .menu-bar button, .menu-bar input, .menu-bar label {
    margin: 0 15px;
  }

  .menu-bar input[type="number"] {
    width: 100px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .menu-bar input[type="checkbox"] {
    transform: scale(1.5);
    margin-left: 10px;
  }

  .plots-container {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    padding: 20px;
  }

  .plot {
    flex: 1;
    margin: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
</style>

<main>
  <div class="menu-bar">
    <button on:click={startAnimation}>Start</button>
    <button on:click={stopAnimation}>Stop</button>
    <label>
      Max Epoch:
      <input type="number" bind:value={epochs} min="1" />
    </label>
    <label>
      Learning Rate:
      <input type="number" bind:value={learningRate} min="0.0001" max="0.1" step="0.001" />
    </label>
    <label>
      Use Bias:
      <input type="checkbox" bind:checked={useBias} />
    </label>
    <label>
      Dataset:
      <select bind:value={datasetType}>
        <option value={DatasetType.RANDOM}>Random</option>
        <option value={DatasetType.BOSTON}>Boston</option>
        <option value={DatasetType.SCORES}>Student scores</option>
      </select>
    </label>
  </div>
  <LoadingBar {progress} {tickPrecision} {epochs} />
  <div class="plots-container">
    <div class="plot">
      <DataPlot {dataPoints} {currentSlope} />
    </div>
    <div class="plot">
      <LossPlot {lossData} {currentSlope} {currentLoss} {currentBias} {useBias} />
    </div>
  </div>
</main>