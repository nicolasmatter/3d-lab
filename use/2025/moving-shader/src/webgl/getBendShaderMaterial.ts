import * as THREE from "three";
import vertexShader from "~/shaders/vertex.glsl?raw";
import fragmentShader from "~/shaders/fragment.glsl?raw";

export default function getBendShaderMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      uTexture: { value: null },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uMeshSize: { value: new THREE.Vector2(0, 0) },
      uImageSize: { value: new THREE.Vector2(0, 0) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    },
  });
}
