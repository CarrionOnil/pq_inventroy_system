import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';

function Model({ modelPath, isExploded, onPartClick, setHovered }) {
  const gltf = useLoader(GLTFLoader, modelPath);

  useEffect(() => {
    let meshCount = 0;
    console.log(`🔍 Loaded model: ${modelPath}`);
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        meshCount++;
        console.log(`Mesh ${meshCount}: ${child.name}`, child);
      }
    });
    console.log(`Total mesh parts: ${meshCount}`);
  }, [gltf, modelPath]);

  const parts = useMemo(() => {
    const items = [];
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        const originalColor = child.material.color.clone();
        if (child.name.toLowerCase().includes('piston')) {
          child.material.color.set('red');
        } else {
          child.material.color.set('#ccc');
        }

        items.push({ mesh: child, originalColor });
      }
    });
    return items;
  }, [gltf]);

  return (
    <>
      {isExploded ? (
        parts.map(({ mesh }, index) => (
          <primitive
            key={index}
            object={mesh}
            onPointerOver={(e) => {
              e.stopPropagation();
              mesh.material.emissive = new THREE.Color('#00bfff');
              mesh.material.emissiveIntensity = 0.5;
              setHovered(mesh.name);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              mesh.material.emissiveIntensity = 0;
              setHovered(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onPartClick(mesh);
            }}
          />
        ))
      ) : (
        <primitive object={gltf.scene} scale={1.5} />
      )}
    </>
  );
}

export default function ModelViewer() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [exploded, setExploded] = useState(false);
  const [hoveredPart, setHoveredPart] = useState(null);

  const modelPath = exploded
    ? '/models/M115 ASM EXPLODED.glb'
    : '/models/M115 ASM.glb';

  return (
    <div className="relative h-[600px] w-full bg-gray-900 rounded-xl shadow-md">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <Stage environment="city" intensity={0.6}>
          <Model
            modelPath={modelPath}
            isExploded={exploded}
            onPartClick={setSelectedPart}
            setHovered={setHoveredPart}
          />
        </Stage>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>

      <button
        onClick={() => setExploded((prev) => !prev)}
        className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {exploded ? 'Collapse' : 'Explode'}
      </button>

      {selectedPart && (
        <div className="absolute bottom-4 right-4 bg-white text-black p-4 rounded shadow-lg w-64">
          <h2 className="text-lg font-bold">Part Info</h2>
          <p><strong>Name:</strong> {selectedPart.name}</p>
          <p><strong>Position:</strong> {selectedPart.position.toArray().join(', ')}</p>
          <button
            className="mt-2 text-sm text-blue-600 hover:underline"
            onClick={() => setSelectedPart(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
