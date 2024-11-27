<script>
  export let progress = 0;
  export let tickPrecision = 10;
  export let maxEpoch = 1000;
</script>

<style>
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e9ecef;
    border-radius: 999px;
    overflow: hidden;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  }

  .progress {
    height: 100%;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
    transition: width 0.3s ease;
    border-radius: 999px;
  }

  .tick-marks {
    position: relative;
    width: 100%;
    height: 4px;
    margin-top: 4px;
  }

  .tick {
    position: absolute;
    width: 2px;
    height: 100%;
    background-color: #dee2e6;
    border-radius: 999px;
  }
</style>

<div class="progress-bar">
  <div class="progress" style="width: {progress}%;"></div>
</div>