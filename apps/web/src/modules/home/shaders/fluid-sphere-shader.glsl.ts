export const fluidSphereVertex = `
  uniform float u_time;
  uniform float u_intensity;

  varying vec3 vNormal;
  varying vec3 vPosition;

  float noise(vec3 p) {
    return sin(p.x*2.7) * cos(p.y*2.2) * sin(p.z*1.4);
  }

  void main() {
    vec3 pos = position;
    float t = u_time * 0.1;

    float n1 = noise(pos*1.0 + t*0.6) * 0.2;
    float n2 = noise(pos*1.5 - t*1.5) * 0.4;
    float n3 = noise(pos*2.9 + t*0.5) * 0.1;
    float displacement = (n1 + n2 + n3) * u_intensity;

    pos += normalize(pos) * displacement;

    vNormal = normalize(normalMatrix * normalize(pos));
    vPosition = (modelViewMatrix * vec4(pos,1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
  }
`;

export const fluidSphereFragment = `
  uniform float u_time;
  uniform vec3 u_lightPos;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 lightDir = normalize(u_lightPos - vPosition);
    vec3 normal = normalize(vNormal);

    float diffuse = max(dot(normal, lightDir), 0.2);
    vec3 viewDir = normalize(-vPosition);
    float rim = pow(1.0 - max(dot(viewDir, normal), 0.0), 1.5);

    float t = sin(u_time*1.0)*0.5 + 0.5;
    vec3 baseColor = mix(vec3(0.1,0.2,0.3), vec3(0.3,0.5,0.7), t);

    vec3 finalColor = baseColor + diffuse*0.6 + rim*vec3(1.0,0.5,0.8);

    gl_FragColor = vec4(finalColor, 0.75);
  }
`;
