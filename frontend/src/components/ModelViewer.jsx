import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useState, useRef, useEffect } from 'react';

function Model({ onPartClick, exploded }) {
  const gltf = useLoader(GLTFLoader, '/models/M115 ASM.glb');
  const modelRef = useRef();

  useEffect(() => {
    if (!modelRef.current) return;

    const meshes = [];

    modelRef.current.traverse((child) => {
      if (child.isMesh) {
        // Save original position once
        if (!child.userData.originalPosition) {
          child.userData.originalPosition = child.position.clone();
        }

        // Store mesh
        meshes.push(child);

        // Color setup
        child.material.color.set('#ccc');
        if (child.name.toLowerCase().includes('piston')) {
          child.material.color.set('red');
        }

        // Clickable
        child.cursor = 'pointer';
        child.onClick = (e) => {
          e.stopPropagation();
          onPartClick(child);
        };
      }
    });

    // Explode logic
    if (exploded) {
      const offset = 1;
      meshes.forEach((mesh, i) => {
        const angle = (i / meshes.length) * 2 * Math.PI;
        const direction = [Math.cos(angle), 0.5, Math.sin(angle)];
        mesh.position.set(
          mesh.userData.originalPosition.x + direction[0] * offset,
          mesh.userData.originalPosition.y + direction[1] * offset,
          mesh.userData.originalPosition.z + direction[2] * offset
        );
      });
    } else {
      meshes.forEach((mesh) => {
        mesh.position.copy(mesh.userData.originalPosition);
      });
    }
  }, [gltf, onPartClick, exploded]);

  return <primitive object={gltf.scene} ref={modelRef} scale={1.5} />;
}

export default function ModelViewer() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [exploded, setExploded] = useState(false);

  return (
    <div className="relative h-[600px] w-full bg-gray-900 rounded-xl shadow-md">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <Stage environment="city" intensity={0.6}>
          <Model onPartClick={setSelectedPart} exploded={exploded} />
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
