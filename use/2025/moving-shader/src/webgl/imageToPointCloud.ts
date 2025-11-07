import * as THREE from "three";

/**
 * Converts an image to a Three.js point cloud BufferGeometry
 * @param image - The loaded image element
 * @param samplingRate - Sample every Nth pixel (1 = every pixel, 2 = every other pixel, etc.)
 * @returns BufferGeometry with position and color attributes
 */
export function imageToPointCloud(
  image: HTMLImageElement,
  samplingRate: number = 1
): THREE.BufferGeometry {
  // Create canvas to read pixel data
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2D context");
  }

  // Draw image and get pixel data
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const width = canvas.width;
  const height = canvas.height;

  // Calculate number of points based on sampling rate
  const numPointsX = Math.ceil(width / samplingRate);
  const numPointsY = Math.ceil(height / samplingRate);
  const numPoints = numPointsX * numPointsY;

  // Create arrays for position and color
  const positions = new Float32Array(numPoints * 3);
  const colors = new Float32Array(numPoints * 3);

  let pointIndex = 0;

  // Iterate through pixels
  for (let i = 0; i < height; i += samplingRate) {
    for (let j = 0; j < width; j += samplingRate) {
      // Normalize coordinates to screen-centered space
      const x = j / width - 0.5;
      const y = -(i / height) + height / (2 * width);
      const z = 0;

      // Get pixel color (RGBA format)
      const pixelIndex = (i * width + j) * 4;
      const r = pixels[pixelIndex] / 255;
      const g = pixels[pixelIndex + 1] / 255;
      const b = pixels[pixelIndex + 2] / 255;

      // Store position
      positions[pointIndex * 3] = x;
      positions[pointIndex * 3 + 1] = y;
      positions[pointIndex * 3 + 2] = z;

      // Store color
      colors[pointIndex * 3] = r;
      colors[pointIndex * 3 + 1] = g;
      colors[pointIndex * 3 + 2] = b;

      pointIndex++;
    }
  }

  // Create BufferGeometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Clean up
  canvas.remove();

  return geometry;
}

/**
 * Loads an image and converts it to a point cloud
 * @param imagePath - Path to the image
 * @param samplingRate - Sample every Nth pixel
 * @returns Promise that resolves to BufferGeometry
 */
export async function loadImageAsPointCloud(
  imagePath: string,
  samplingRate: number = 1
): Promise<THREE.BufferGeometry> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const geometry = imageToPointCloud(image, samplingRate);
        resolve(geometry);
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => {
      reject(new Error(`Failed to load image: ${imagePath}`));
    };
    image.src = imagePath;
  });
}
