#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uOffset;

varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
    float bendStrength = 0.15;

    position.x = position.x + (sin(uv.y * M_PI) * offset.x) * bendStrength;
    position.y = position.y + (sin(uv.x * M_PI) * offset.y) * bendStrength;
    return position;
}

void main() {

    vec3 pos = position;
    pos.y *= 1.0;
    pos.z *= 1.0;
    pos.x *= 1.0;

    vec3 newPosition = deformationCurve(pos, uv, uOffset);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vUv = uv;
}
