"use strict";

/**
 * React hook for MediaPipe Hands real-time hand tracking.
 * Provides webcam capture, hand landmark detection, and cleanup.
 */

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * MediaPipe Hands custom hook for real-time hand gesture recognition.
 *
 * @returns {object} Hand tracking state and controls
 * @property {boolean} cameraActive - Whether camera is active
 * @property {Array} landmarks - Detected hand landmarks (or null if not detected)
 * @property {string} error - Error message (or null if no error)
 * @property {Function} startCamera - Function to start camera
 * @property {Function} stopCamera - Function to stop camera
 */

const useHandTracking = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [landmarks, setLandmarks] = useState(null);
  const [error, setError] = useState(null);

  // Store MediaPipe instance and stream reference in closure
  const handsRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const cameraActiveRef = useRef(false);
  const startingRef = useRef(false);
  const frameRequestRef = useRef(null);

  /**
   * Initialize MediaPipe Hands with optimal configuration
   */
  const initializeMediaPipe = useCallback(async () => {
    if (!window.Hands) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Hand tracking model could not be loaded'));
        document.head.appendChild(script);
      });
    }

    const hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const formattedHands = results.multiHandLandmarks.map((hand) => (
          hand.map((landmark) => ({
            x: landmark.x,
            y: landmark.y,
            z: landmark.z
          }))
        ));
        setLandmarks(formattedHands);
      } else {
        setLandmarks(null);
      }
    });

    await hands.initialize();

    return hands;
  }, []);

  /**
   * Start the camera and initialize MediaPipe
   */
  const startCamera = useCallback(async () => {
    if (startingRef.current || cameraActiveRef.current) {
      return;
    }

    startingRef.current = true;
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Wait for video to be ready
      await new Promise((resolve) => {
        if (videoRef.current && videoRef.current.readyState >= 1) {
          resolve();
        } else if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => resolve();
        } else {
          resolve();
        }
      });

      await videoRef.current?.play();
      setCameraActive(true);
      cameraActiveRef.current = true;
      setError(null);

      // Camera access is useful even if the optional hand model is unavailable.
      try {
        if (!handsRef.current) {
          handsRef.current = await initializeMediaPipe();
        }
      } catch (modelError) {
        console.error('Error loading hand tracking:', modelError);
        setError(`Hand tracking unavailable: ${modelError.message}`);
      }

      const processFrame = async () => {
        if (videoRef.current && canvasRef.current && handsRef.current && cameraActiveRef.current) {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          try {
            await handsRef.current.send({ image: canvas });
          } catch (inferenceError) {
            console.error('MediaPipe inference failed:', inferenceError);
            setError(`Hand detection unavailable: ${inferenceError.message}`);
          }

          if (cameraActiveRef.current) {
            frameRequestRef.current = requestAnimationFrame(processFrame);
          }
        }
      };

      processFrame();
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(`Camera access denied: ${err.message}`);
      setCameraActive(false);
    } finally {
      startingRef.current = false;
    }
  }, [initializeMediaPipe]);

  /**
   * Stop camera and clean up resources
   */
  const stopCamera = useCallback(() => {
    if (frameRequestRef.current) {
      cancelAnimationFrame(frameRequestRef.current);
      frameRequestRef.current = null;
    }

    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    cameraActiveRef.current = false;
    setLandmarks(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (handsRef.current) {
        handsRef.current.close();
        handsRef.current = null;
      }
    };
  }, [stopCamera]);

  return {
    cameraActive,
    landmarks,
    error,
    startCamera,
    stopCamera,
    videoRef,
    canvasRef
  };
};

export default useHandTracking;