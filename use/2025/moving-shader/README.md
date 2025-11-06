# Moving Shader

An interactive WebGL shader experiment that creates a dynamic RGB shift effect based on mouse movement. The shader applies chromatic aberration that responds to mouse velocity and position, with distance-based delay creating a wave-like bounce-back effect.

## Features

- **Mouse-tracking RGB shift**: Chromatic aberration effect that follows mouse movement
- **Velocity-based offset**: Faster mouse movement creates stronger distortion
- **Distance-based delay**: Pixels closer to the mouse bounce back faster, creating a ripple effect
- **Custom GLSL shaders**: Vertex and fragment shaders for bend distortion and RGB separation
- **Three.js integration**: WebGL rendering with perspective camera and scene management

## Project Structure

```text
/
├── public/
│   └── image.png          # Texture image for the shader
├── src/
│   ├── pages/
│   │   └── index.astro    # Main page with Three.js setup
│   ├── shaders/
│   │   ├── vertex.glsl    # Vertex shader for bend distortion
│   │   └── fragment.glsl # Fragment shader for RGB shift
│   └── webgl/
│       ├── getBendShaderMaterial.ts  # Shader material setup
│       ├── usePerspectiveCamera.ts   # Camera utilities
│       └── useScene.ts               # Scene utilities
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How It Works

1. **Mouse Tracking**: The mouse position and movement delta are tracked in real-time
2. **Offset Calculation**: Mouse movement speed and direction are converted to offset values
3. **Shader Application**: The offset is passed to the shader material, which applies:
   - **RGB Shift**: Red and blue channels are shifted in opposite directions
   - **Distance-based Delay**: Pixels further from the mouse position maintain the effect longer
4. **Decay**: The offset gradually decays back to zero, creating a smooth bounce-back effect

## Customization

### Adjust Offset Strength

In `src/pages/index.astro`, modify the `offsetStrength` object:

```javascript
const offsetStrength = {
  x: 0.0006, // Horizontal offset multiplier
  y: 0.0006, // Vertical offset multiplier
};
```

### Adjust Decay Rate

In the `tick()` function, modify the decay value:

```javascript
const decay = 0.95; // Closer to 1.0 = slower decay
```

### Modify Shader Effects

Edit the shader files in `src/shaders/`:

- `vertex.glsl`: Controls the 3D bend/distortion
- `fragment.glsl`: Controls the RGB shift and distance-based delay

## Year

2025

## Key Learnings

- GLSL shader programming with Three.js
- Mouse tracking and velocity calculation
- Distance-based effects in fragment shaders
- RGB shift/chromatic aberration techniques
- Smooth decay animations for interactive effects

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [GLSL Shader Language](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)
- [Astro Documentation](https://docs.astro.build)
