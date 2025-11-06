#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture;
uniform vec2 uOffset;
uniform vec2 uMouse;
uniform vec2 uMeshSize;

varying vec2 vUv;

vec4 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
    float r = texture2D(textureImage, uv + offset).r;
    float g = texture2D(textureImage, uv).g;
    float b = texture2D(textureImage, uv - offset).b;
    float a = texture2D(textureImage, uv).a;
    return vec4(r, g, b, a);
}

void main() {
    vec2 uv = vUv;

    // Mouse position is already normalized to [0, 1] UV space
    vec2 mouseUv = uMouse;

    // Calculate distance from current pixel to mouse position in UV space
    float distToMouse = distance(uv, mouseUv);

    // Create distance-based delay factor
    // Pixels closer to mouse (smaller distance) = faster bounce back (less persistence)
    // Pixels further from mouse (larger distance) = slower bounce back (more persistence)
    // Use smoothstep to create a smooth falloff
    float maxDistance = 1.0; // Maximum distance in UV space
    float delayFactor = smoothstep(0.0, maxDistance, distToMouse);

    // Invert so closer pixels have less effect (bounce back faster)
    // and further pixels have more effect (take time to bounce back)
    delayFactor = 1.0 - delayFactor;

    // Apply delay factor to offset - pixels further get more offset persistence
    vec2 delayedOffset = uOffset * (0.3 + delayFactor * 0.7); // Scale between 0.3 and 1.0

    /* texture */
    vec4 color = rgbShift(uTexture, vUv, delayedOffset);

    /* border radius */
    float radius = 0.015;
    vec2 boxBnd = vec2(0.5 - radius, 0.5 - radius);

    // In order to make sure visual distances are preserved, we multiply everything by aspectRatio
    vec2 aspectRatio = vec2(1.0, 1.0);
    boxBnd *= aspectRatio;

    // Output to screen -> if alpha <= 0.0 -> show texture, else show transparent
    float border = length(max(abs(uv - vec2(0.5, 0.5)) - boxBnd, 0.0)) - radius;

    // determine alpha based on image transparency or by border radius
    // float alpha = 1.0 - step(0.0, border);
    float alpha = color.a - step(0.0, border);

    gl_FragColor = vec4(color.xyz, alpha);
}
