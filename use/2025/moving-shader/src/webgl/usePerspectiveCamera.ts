import * as THREE from "three";

export default function usePerspectiveCamera(
  distance = 30,
  sizes: {
    width: number;
    height: number;
  },
  far = 200
) {
  const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    far
  );
  camera.position.set(0, 0, distance);

  function getWorldSizes(): { width: number; height: number } {
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const height = 2 * Math.tan(vFOV / 2) * distance;
    const width = height * camera.aspect;
    return {
      height,
      width,
    };
  }

  function updateCamera(sizes: { width: number; height: number }) {
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  }

  function moveCameraPositionBy(x: number, y: number) {
    camera.position.x += x;
    camera.position.y += y;
  }

  return {
    camera,
    getWorldSizes,
    updateCamera,
    moveCameraPositionBy,
  };
}
