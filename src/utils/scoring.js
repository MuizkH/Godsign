"use strict";

/**
 * Utility functions for hand gesture scoring and recognition.
 * Uses Euclidean distance to compare hand landmarks against reference vectors.
 */

/**
 * Normalize hand landmarks by subtracting wrist position and scaling by hand size.
 * Makes the vector invariant to hand position and scale.
 *
 * @param {Array} landmarks - Array of 21 {x, y, z} objects
 * @returns {Array} Normalized 63-dimensional vector
 */
const normalizeLandmarks = (landmarks) => {
  if (!landmarks || landmarks.length < 21) {
    return null;
  }

  // Wrist is landmark 0
  const wrist = landmarks[0];

  // Find max distance from wrist to other landmarks for scaling
  let maxDist = 0;
  for (let i = 1; i < landmarks.length; i++) {
    const dx = landmarks[i].x - wrist.x;
    const dy = landmarks[i].y - wrist.y;
    const dz = landmarks[i].z - wrist.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist > maxDist) {
      maxDist = dist;
    }
  }

  // Avoid division by zero
  if (maxDist === 0) {
    maxDist = 1;
  }

  // Normalize: subtract wrist, divide by max distance
  const normalized = [];
  for (let i = 0; i < landmarks.length; i++) {
    normalized.push((landmarks[i].x - wrist.x) / maxDist);
    normalized.push((landmarks[i].y - wrist.y) / maxDist);
    normalized.push((landmarks[i].z - wrist.z) / maxDist);
  }

  return normalized;
};

const normalizeReferenceVector = (vector) => {
  if (!vector || vector.length < 63) {
    return null;
  }

  const landmarks = Array.from({ length: 21 }, (_, index) => ({
    x: vector[index * 3],
    y: vector[index * 3 + 1],
    z: vector[index * 3 + 2]
  }));

  return normalizeLandmarks(landmarks);
};

/**
 * Calculate Euclidean distance between two vectors.
 *
 * @param {Array} vecA - First vector
 * @param {Array} vecB - Second vector
 * @returns {number} Euclidean distance
 */
const euclideanDistance = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return Infinity;
  }

  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
};

/**
 * Calculate confidence score from distance.
 * Score is 0-100%, where 100% is a perfect match.
 *
 * @param {number} distance - Euclidean distance
 * @param {number} threshold - Maximum distance for 0% score
 * @returns {number} Confidence score (0-100)
 */
const distanceToScore = (distance, threshold = 1.5) => {
  const score = Math.max(0, 100 * (1 - distance / threshold));
  return Math.round(score);
};

/**
 * Find the best matching sign from reference vectors.
 *
 * @param {Array} normalizedLandmarks - Normalized landmark vector
 * @param {Array} signRefs - Array of reference vectors (one per sign)
 * @returns {object} Best match result
 */
const findBestMatch = (normalizedLandmarks, signRefs) => {
  if (!normalizedLandmarks || !signRefs || signRefs.length === 0) {
    return {
      target: -1,
      score: 0,
      distances: []
    };
  }

  const distances = [];
  for (let i = 0; i < signRefs.length; i++) {
    const dist = euclideanDistance(normalizedLandmarks, signRefs[i]);
    distances.push(dist);
  }

  let minDist = Infinity;
  let bestIdx = -1;
  for (let i = 0; i < distances.length; i++) {
    if (distances[i] < minDist) {
      minDist = distances[i];
      bestIdx = i;
    }
  }

  const score = distanceToScore(minDist);

  return {
    target: bestIdx,
    score: score,
    distances: distances,
    minDistance: minDist
  };
};

/**
 * Get feedback text based on score.
 *
 * @param {number} score - Confidence score (0-100)
 * @returns {string} Feedback message
 */
const getFeedbackText = (score) => {
  if (score >= 90) {
    return "Excellent sign match! Ready to proceed!";
  } else if (score >= 75) {
    return "Good match! Adjust slightly";
  } else if (score >= 50) {
    return "Keep practicing, adjust wrist angle";
  } else if (score >= 25) {
    return "Align hand inside box to begin...";
  } else {
    return "No hand detected or poor alignment";
  }
};

export {
  normalizeLandmarks,
  normalizeReferenceVector,
  euclideanDistance,
  distanceToScore,
  findBestMatch,
  getFeedbackText
};