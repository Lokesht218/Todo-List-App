import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Plane } from '@react-three/drei';
import * as THREE from 'three';

// This inner component handles the 3D plane and its animation.
function FloatingImage() {
  // Reference to the mesh (the 3D plane) so we can manipulate it
  const meshRef = useRef();
  
  // Load the texture from your image URL.
  // Note: It's better to host the image locally, but this will work for now.
  const texture = useTexture('https://png.pngtree.com/background/20230623/original/pngtree-colorful-abstract-red-brick-3d-wallpaper-perfect-for-unique-wall-d-picture-image_3988967.jpg');

  // Store mouse position to drive the parallax effect
  const mousePos = useRef({ x: 0, y: 0 });

  // useEffect to track mouse movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse coordinates to a range between -1 and 1
      mousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // This hook runs every frame to create smooth animations
  useFrame(() => {
    if (meshRef.current) {
      // Smoothly rotate the plane based on mouse position for a 3D parallax effect
      // The 0.5 factor controls the intensity of the effect.
      meshRef.current.rotation.y = mousePos.current.x * 0.5;
      meshRef.current.rotation.x = mousePos.current.y * 0.3;
      
      // Add a subtle floating animation: move the plane up and down slowly
      meshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <Plane
      ref={meshRef}
      args={[5, 3]} // Width and height of the plane (adjust as needed)
      scale={[window.innerWidth / 4, window.innerHeight / 4, 1]} // Scale to fill the screen better
    >
      <meshBasicMaterial map={texture} toneMapped={false} /> // `toneMapped: false` keeps colors vibrant
    </Plane>
  );
}

// The main component that sets up the 3D Canvas
const ThreeDBackground = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 3] }} // Position the camera in front of the plane
        style={{ background: '#000000' }} // Fallback background color
        gl={{ alpha: false }} // Improve performance by disabling alpha blending
      >
        <FloatingImage />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;