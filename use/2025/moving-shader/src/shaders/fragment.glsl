#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture;
uniform vec2 uOffset;

varying vec2 vUv;

vec4 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
    float r = texture2D(textureImage, uv + offset * 0.0).r;
    vec2 gb = texture2D(textureImage, uv).gb;
    float a = texture2D(textureImage, uv).a;
    return vec4(r, gb, a);
}

void main() {
    vec2 uv = vUv;

    /* texture */
    vec4 color = rgbShift(uTexture, vUv, uOffset);

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
