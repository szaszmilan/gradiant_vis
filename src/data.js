import Papa from 'papaparse';

export function generateRandomData(numPoints = 50, slope = 2, noiseLevel = 1) {
  const dataPoints = [];
  const yOffset = Math.random() * 10; // yOffset is now random between 0 and 10
  for (let i = 0; i < numPoints; i++) {
    const x = Math.random() * 10;
    const y = slope * x + (Math.random() - 0.5) * noiseLevel * 2 + yOffset; // y = slope * x + noise + yOffset
    dataPoints.push({ x, y });
  }
  return dataPoints;
}

export const DatasetType = {
  RANDOM: 'random',
  BOSTON: 'boston',
  SCORES: 'student scores'
};

async function loadCSV(filePath) {
  const response = await fetch(filePath);
  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
}

function filterValidRows(data, requiredFields) {
  return data.filter(row => 
    requiredFields.every(field => row[field] !== null && row[field] !== undefined && !isNaN(row[field]))
  );
}

export async function loadDataset(type) {
  switch (type) {
    case DatasetType.BOSTON:
      // Load Boston dataset from CSV
      const bostonData = await loadCSV('datasets/housing.csv');
      const validBostonData = filterValidRows(bostonData, ['rm', 'medv']);
      return validBostonData.map(row => ({ x: row.rm, y: row.medv })); // Using RM (average number of rooms per dwelling) as the feature
    case DatasetType.SCORES:
      // Load Scores dataset from CSV
      const scoresData = await loadCSV('datasets/scores.csv');
      const validScoresData = filterValidRows(scoresData, ['Hours', 'Scores']);
      return validScoresData.map(row => ({ x: row.Hours, y: row.Scores })); // Using Hours as the feature
    case DatasetType.RANDOM:
    default:
      return generateRandomData();
  }
}