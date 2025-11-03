"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function GeometricScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    meshes: THREE.Mesh[];
    mouse: { x: number; y: number };
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x6366f1, 0.3);
    pointLight.position.set(-5, -5, -5);
    scene.add(pointLight);

    const meshes: THREE.Mesh[] = [];

    const createRainbowMaterial = () => {
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;
          
          vec3 rainbow(float t) {
            t = mod(t, 1.0);
            if (t < 0.1667) {
              return mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.5, 0.0), t * 6.0);
            } else if (t < 0.3333) {
              return mix(vec3(1.0, 0.5, 0.0), vec3(1.0, 1.0, 0.0), (t - 0.1667) * 6.0);
            } else if (t < 0.5) {
              return mix(vec3(1.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0), (t - 0.3333) * 6.0);
            } else if (t < 0.6667) {
              return mix(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.5, 1.0), (t - 0.5) * 6.0);
            } else if (t < 0.8333) {
              return mix(vec3(0.0, 0.5, 1.0), vec3(0.5, 0.0, 1.0), (t - 0.6667) * 6.0);
            } else {
              return mix(vec3(0.5, 0.0, 1.0), vec3(1.0, 0.0, 0.0), (t - 0.8333) * 6.0);
            }
          }
          
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 pos = vWorldPosition;
            
            float angle = atan(pos.y, pos.x) / (2.0 * 3.14159) + 0.5;
            float height = (pos.z * 0.3 + 1.0) * 0.5;
            float distance = length(pos.xy) * 0.4;
            
            float colorOffset = angle + height * 0.5 + distance * 0.3 + time * 0.05;
            vec3 color1 = rainbow(colorOffset);
            vec3 color2 = rainbow(colorOffset + 0.33);
            vec3 color3 = rainbow(colorOffset + 0.66);
            
            float blendFactor = sin(angle * 6.28 + pos.z * 2.0) * 0.5 + 0.5;
            vec3 finalColor = mix(color1, color2, blendFactor);
            finalColor = mix(finalColor, color3, blendFactor * 0.5);
            
            float brightness = dot(normal, vec3(0.5, 0.8, 1.0));
            brightness = brightness * 0.3 + 0.7;
            
            finalColor = finalColor * brightness * 1.4;
            gl_FragColor = vec4(finalColor, 0.95);
          }
        `,
        transparent: true,
      });
    };

    const createSphereMaterial = () => {
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec3 vNormal;
          varying vec2 vUv;
          
          void main() {
            vec3 normal = normalize(vNormal);
            float gradient = (normal.y + 1.0) * 0.5;
            
            vec3 blue = vec3(0.2, 0.5, 1.0);
            vec3 purple = vec3(0.5, 0.2, 0.8);
            
            vec3 color = mix(blue, purple, gradient);
            
            float stripe = sin(vUv.y * 20.0 + time * 0.5) * 0.5 + 0.5;
            color *= (0.7 + stripe * 0.3);
            
            float brightness = dot(normal, vec3(0.3, 0.6, 1.0));
            brightness = brightness * 0.3 + 0.7;
            
            gl_FragColor = vec4(color * brightness, 0.85);
          }
        `,
        transparent: true,
      });
    };

    const shapes = [
      { geometry: new THREE.IcosahedronGeometry(1.04, 0), material: createRainbowMaterial(), position: [0, 0, 0] },
      { geometry: new THREE.BoxGeometry(0.78, 1.2, 0.6), material: createRainbowMaterial(), position: [-3, 1.5, -1.5] },
      { geometry: new THREE.TetrahedronGeometry(0.65, 0), material: createRainbowMaterial(), position: [3, -1.5, 1.5] },
      { geometry: new THREE.BoxGeometry(0.78, 0.78, 0.78), material: createRainbowMaterial(), position: [-2, -2, 1.5] },
      { geometry: new THREE.TorusGeometry(0.52, 0.195, 16, 32), material: createRainbowMaterial(), position: [2.5, 1.5, -2] },
      { geometry: new THREE.OctahedronGeometry(0.65, 0), material: createRainbowMaterial(), position: [-3.5, 0, 0.5] },
    ];

    const glowMeshes: THREE.Mesh[] = [];

    shapes.forEach((shape, index) => {
      const mesh = new THREE.Mesh(shape.geometry, shape.material);
      mesh.position.set(shape.position[0], shape.position[1], shape.position[2]);
      scene.add(mesh);
      meshes.push(mesh);

      const glowColors = [
        0x8b5cf6,
        0x3366ff,
        0xec4899,
        0x6366f1,
        0xa855f7,
      ];

      const glowGeometry = new THREE.CircleGeometry(2.4, 32);
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(glowColors[index % glowColors.length]) },
          time: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float time;
          varying vec2 vUv;
          
          void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            float glow = 1.0 - smoothstep(0.0, 1.0, dist * 2.0);
            glow = pow(glow, 2.0);
            
            float alpha = glow * 0.25 * (0.8 + sin(time * 0.5) * 0.2);
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.set(
        shape.position[0],
        shape.position[1],
        shape.position[2] - 1.5
      );
      glowMesh.lookAt(camera.position);
      glowMesh.renderOrder = -1;
      scene.add(glowMesh);
      glowMeshes.push(glowMesh);
    });

    const mouse = { x: 0, y: 0, normalizedX: 0, normalizedY: 0 };
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.normalizedX = (mouse.x / rect.width) * 2 - 1;
      mouse.normalizedY = -(mouse.y / rect.height) * 2 + 1;
    };

    const handleMouseLeave = () => {
      mouse.x = 0;
      mouse.y = 0;
      mouse.normalizedX = 0;
      mouse.normalizedY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;
    const targetPositions = meshes.map(() => ({ x: 0, y: 0, z: 0 }));
    const originalPositions = shapes.map((shape) => ({
      x: shape.position[0],
      y: shape.position[1],
      z: shape.position[2],
    }));
    const hoverStartTimes = meshes.map(() => -1);
    const hoverDelay = 200;

    const animate = () => {
      time += 0.005;
      
      raycaster.setFromCamera(
        new THREE.Vector2(mouse.normalizedX, mouse.normalizedY),
        camera
      );
      
      const intersects = raycaster.intersectObjects(meshes);
      const hoveredIndex = intersects.length > 0 ? meshes.indexOf(intersects[0].object as THREE.Mesh) : -1;
      
      const currentTime = Date.now();
      
      meshes.forEach((mesh, index) => {
        const material = mesh.material as THREE.ShaderMaterial;
        if (material.uniforms?.time) {
          material.uniforms.time.value = time;
        }

        const baseRotationSpeed = 0.002 + (index % 2) * 0.001;
        mesh.rotation.x += baseRotationSpeed;
        mesh.rotation.y += baseRotationSpeed * 1.2;

        const originalPos = originalPositions[index];
        const floatOffset = Math.sin(time * 0.3 + index * 1.2) * 0.2;
        
        if (hoveredIndex === index && (mouse.x !== 0 || mouse.y !== 0)) {
          if (hoverStartTimes[index] === -1) {
            hoverStartTimes[index] = currentTime;
          }
          
          const hoverDuration = currentTime - hoverStartTimes[index];
          const delayProgress = Math.min(hoverDuration / hoverDelay, 1);
          const easeIn = delayProgress * delayProgress;
          
          const followAmount = 0.25 * easeIn;
          const direction = new THREE.Vector3(
            mouse.normalizedX * 2,
            mouse.normalizedY * 2,
            0
          );
          
          targetPositions[index].x = originalPos.x + direction.x * followAmount;
          targetPositions[index].y = originalPos.y + direction.y * followAmount + floatOffset;
          targetPositions[index].z = originalPos.z + direction.z * 0.15 * easeIn;
        } else {
          hoverStartTimes[index] = -1;
          targetPositions[index].x = originalPos.x;
          targetPositions[index].y = originalPos.y + floatOffset;
          targetPositions[index].z = originalPos.z;
        }
        
        mesh.position.x += (targetPositions[index].x - mesh.position.x) * 0.08;
        mesh.position.y += (targetPositions[index].y - mesh.position.y) * 0.08;
        mesh.position.z += (targetPositions[index].z - mesh.position.z) * 0.08;

        if (glowMeshes[index]) {
          const glowMaterial = glowMeshes[index].material as THREE.ShaderMaterial;
          if (glowMaterial.uniforms?.time) {
            glowMaterial.uniforms.time.value = time;
          }
          
          glowMeshes[index].position.x = mesh.position.x;
          glowMeshes[index].position.y = mesh.position.y;
          glowMeshes[index].position.z = mesh.position.z - 1.5;
          glowMeshes[index].lookAt(camera.position);
        }
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    let animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      meshes,
      mouse,
      animationId,
    };

    const currentContainer = container;
    const currentAnimationId = animationId;

    return () => {
      window.removeEventListener("resize", handleResize);
      currentContainer.removeEventListener("mousemove", handleMouseMove);
      currentContainer.removeEventListener("mouseleave", handleMouseLeave);
      
      if (currentAnimationId) {
        cancelAnimationFrame(currentAnimationId);
      }
      
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat: THREE.Material) => mat.dispose());
        } else {
          mesh.material.dispose();
        }
      });
      
      renderer.dispose();
      if (currentContainer && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-visible pointer-events-auto" />;
}
