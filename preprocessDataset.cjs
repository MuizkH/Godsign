const fs = require('fs');
const path = require('path');

// CSV file path
const csvPath = path.join(__dirname, 'Dataset for ISL', 'Indian Sign Language Gesture Landmarks.csv');

// Read the CSV file
console.log('Reading CSV file...');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');

// Parse header
const header = lines[0].split(',');
console.log('Header columns:', header.length);

// Process data - debug first few rows
for (let i = 1; i < Math.min(5, lines.length); i++) {
  const values = lines[i].split(',');
  console.log(`Row ${i}: ${values.length} values, first 5:`, values.slice(0, 5));
}

// Process data properly
const records = [];
for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',');
  if (values.length >= 128) {
    const target = parseFloat(values[0]);
    if (isNaN(target)) {
      console.log(`Row ${i}: Invalid target value:`, values[0]);
      continue;
    }
    const usesTwoHands = parseFloat(values[1]);
    const leftHand = [];
    const rightHand = [];
    
    // Left hand: columns 2-64 (63 values = 21 landmarks × 3)
    for (let j = 0; j < 21; j++) {
      const idx = 2 + j * 3;
      if (idx + 2 < values.length) {
        leftHand.push({
          x: parseFloat(values[idx]),
          y: parseFloat(values[idx + 1]),
          z: parseFloat(values[idx + 2])
        });
      }
    }
    
    // Right hand: columns 65-127 (63 values = 21 landmarks × 3)
    for (let j = 0; j < 21; j++) {
      const idx = 65 + j * 3;
      if (idx + 2 < values.length) {
        rightHand.push({
          x: parseFloat(values[idx]),
          y: parseFloat(values[idx + 1]),
          z: parseFloat(values[idx + 2])
        });
      }
    }
    
    records.push({ target, usesTwoHands, leftHand, rightHand });
  }
}

console.log(`Total records parsed: ${records.length}`);

// Group by target
const grouped = {};
for (const record of records) {
  const t = record.target;
  if (!grouped[t]) {
    grouped[t] = [];
  }
  grouped[t].push(record);
}

console.log('Targets with data:');
for (const [target, recs] of Object.entries(grouped)) {
  console.log(`  Target ${target}: ${recs.length} samples`);
}

// Calculate reference vectors
const signRefs = {};
const labels = [];

for (let t = 0; t <= 25; t++) {
  if (!grouped[t] || grouped[t].length === 0) {
    console.warn(`⚠️ Target ${t} has no data!`);
    continue;
  }
  
  const samples = grouped[t];
  const numSamples = samples.length;
  
  const accLeft = Array(63).fill(0);
  const accRight = Array(63).fill(0);
  
  for (const sample of samples) {
    for (let i = 0; i < 21; i++) {
      accLeft[3 * i] += sample.leftHand[i].x;
      accLeft[3 * i + 1] += sample.leftHand[i].y;
      accLeft[3 * i + 2] += sample.leftHand[i].z;
    }
    
    for (let i = 0; i < 21; i++) {
      accRight[3 * i] += sample.rightHand[i].x;
      accRight[3 * i + 1] += sample.rightHand[i].y;
      accRight[3 * i + 2] += sample.rightHand[i].z;
    }
  }
  
  const avgLeft = accLeft.map(val => val / numSamples);
  const avgRight = accRight.map(val => val / numSamples);
  const combined = [...avgLeft, ...avgRight];
  
  signRefs[t] = combined;
  labels.push(`Sign ${t}`);
  
  console.log(`✓ Target ${t}: ${numSamples} samples, reference vector size: ${combined.length}`);
}

const output = {
  labels: labels,
  signRefs: signRefs
};

const outputPath = path.join(__dirname, 'src', 'signRefs.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`\n✓ Generated ${outputPath}`);
console.log(`✓ Total reference vectors: ${Object.keys(signRefs).length}`);
console.log('✓ Preprocessing complete!');