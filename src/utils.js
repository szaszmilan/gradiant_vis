import { Delaunay } from 'd3-delaunay';

export function precomputeLoss(start, end, precision, data, useBias = true) {
  const points = [];
  const losses = [];

  if (useBias) {
    for (let slope = start; slope <= end; slope += precision) {
      for (let bias = start; bias <= end; bias += precision) {
        const loss = calculateLoss(slope, data, bias, useBias);
        points.push([slope, bias]);
        losses.push(loss);
      }
    }
  } else {
    for (let slope = start; slope <= end; slope += precision) {
      const loss = calculateLoss(slope, data, 0, useBias);
      points.push([slope, 0]);
      losses.push(loss);
    }
  }

  const delaunay = Delaunay.from(points);
  const triangles = delaunay.triangles;

  return [points, losses, triangles];
}

// Loss function
export function calculateLoss(slope, data, bias = 0, useBias = true) {
  return data.reduce((acc, point) => {
    const predicted = slope * point.x + (useBias ? bias : 0);
    return acc + (point.y - predicted) ** 2;
  }, 0) / data.length;
}

// Gradient descent
export function optimize(data, epochs, learningRate, useBias = true) {
  const lossArray = [];
  const params = [];
  let slope = 0;
  let bias = 0;
  for (let i = 0; i < epochs; i++) {
    let gradientSlope = 0;
    let gradientBias = 0;
    data.forEach(point => {
      if (isNaN(point.x) || isNaN(point.y)) {
        console.error(`NaN detected in data point: x=${point.x}, y=${point.y}`);
        return;
      }
      const predicted = slope * point.x + (useBias ? bias : 0);
      gradientSlope += -2 * point.x * (point.y - predicted);
      if (useBias) {
        gradientBias += -2 * (point.y - predicted);
      }
    });
    slope -= (gradientSlope / data.length) * learningRate;
    if (useBias) {
      bias -= (gradientBias / data.length) * learningRate;
    }

    const loss = calculateLoss(slope, data, bias, useBias);
    lossArray.push(loss);
    params.push(useBias ? { slope, bias } : slope);
  }
  return [params, lossArray];
}