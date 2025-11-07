import * as THREE from "three";

import { loadImageAsPointCloud } from "~/webgl/imageToPointCloud";
import usePerspectiveCamera from "~/webgl/usePerspectiveCamera";
import useScene from "~/webgl/useScene";

export default class Experience {
  private canvas: HTMLCanvasElement | null;
  private scene: THREE.Scene;
  private element: Element | null;
  private renderer: THREE.WebGLRenderer;
  private sizes: { width: number; height: number };
  private mouse: {
    current: THREE.Vector2;
    previous: THREE.Vector2;
  };
  private mesh: THREE.Points | null = null;

  constructor() {
    this.canvas = document.querySelector("[data-canvas]");
    const { scene } = useScene();
    this.scene = scene;
    this.element = document.querySelector("[data-element]");

    /* rect */
    this.scene.userData.element = this.element;
    this.scene.userData.boundingRect =
      this.scene.userData.element?.getBoundingClientRect();
    this.scene.userData.updateRect = this.updateRect.bind(this);
    this.scene.userData.updateSizes = this.updateSizes.bind(this);

    this.sizes = {
      width: 0.5,
      height:
        (0.5 / this.scene.userData.boundingRect.width) *
        this.scene.userData.boundingRect.height,
    };

    this.scene.userData.perspectiveCamera = usePerspectiveCamera(
      1,
      this.sizes,
      50
    );

    if (!this.canvas) {
      throw new Error("Canvas not found");
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

    this.mouse = {
      current: new THREE.Vector2(0, 0),
      previous: new THREE.Vector2(0, 0),
    };
  }

  async init() {
    // Load image as point cloud
    const samplingRate = 8; // Sample every 2nd pixel for performance
    const geometry = await loadImageAsPointCloud("/image.jpg", samplingRate);

    // Create PointsMaterial with vertex colors
    const material = new THREE.PointsMaterial({
      size: 0.04, // Adjust point size as needed
      vertexColors: true,
      sizeAttenuation: true,
    });

    // Create Points mesh
    this.mesh = new THREE.Points(geometry, material);
    this.mesh.position.set(0, 0, 0);

    this.scene.add(this.mesh);

    // Setup camera and renderer
    this.updateSizes();
    this.updateRect();
    this.scene.userData.perspectiveCamera.camera.aspect =
      window.innerWidth / window.innerHeight;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.userData.perspectiveCamera.camera.updateProjectionMatrix();

    // Event listeners
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));

    // Start render loop
    this.tick();

    console.log(
      "Point cloud created with",
      geometry.attributes.position.count,
      "particles"
    );
  }

  private tick = () => {
    this.renderer.render(
      this.scene,
      this.scene.userData.perspectiveCamera.camera
    );
    requestAnimationFrame(this.tick);
  };

  private onMouseMove(event: MouseEvent) {
    this.mouse.previous.copy(this.mouse.current);
    this.mouse.current.set(event.clientX, event.clientY);

    // Mouse tracking for future particle effects
    // TODO: Implement particle displacement based on mouse movement
  }

  private updateRect() {
    const rect = this.scene.userData.element.getBoundingClientRect();

    this.scene.userData.boundingRect = {
      width: rect.width,
      height: rect.height,
      right: rect.right,
      left: rect.left,
      bottom: rect.bottom,
      top: rect.top,
    };
  }

  private updateSizes() {
    this.sizes.width = this.scene.userData.boundingRect.width;
    this.sizes.height = this.scene.userData.boundingRect.height;
    this.scene.userData.perspectiveCamera.updateCamera(this.sizes);
  }

  private onResize() {
    this.updateRect();
    this.updateSizes();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.userData.perspectiveCamera.camera.updateProjectionMatrix();
  }
}
