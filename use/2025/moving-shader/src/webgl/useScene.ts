import * as THREE from "three";

export default function useScene() {
  const scene = new THREE.Scene();

  return {
    scene,
  };
}
