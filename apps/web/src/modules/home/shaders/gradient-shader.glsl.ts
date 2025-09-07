export const gradientVertex = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.2);
  }
`;

export const gradientFragment = `
  uniform float u_time;

  void main() {
    vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);
    float time = u_time * 0.2;

    vec3 color1 = vec3(0.04, 0.04, 0.06);
    vec3 color2 = vec3(0.03, 0.08, 0.1);

    vec2 center1 = vec2(0.5 + sin(time) * 0.3, 0.5 + cos(time * 0.7) * 0.2);
    vec2 center2 = vec2(0.3 + cos(time * 1.2) * 0.4, 0.7 + sin(time * 0.9) * 0.3);

    float dist1 = length(uv - center1);
    float dist2 = length(uv - center2);

    float grad1 = exp(-dist1 * 1.0);
    float grad2 = exp(-dist2 * 1.2);

    vec3 finalColor = color1 * grad1 + color2 * grad2;

    finalColor = max(finalColor, vec3(0.08, 0.08, 0.08));
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
