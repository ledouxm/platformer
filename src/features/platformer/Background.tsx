import { usePlane } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import textureImg from "/assets/texture.jpg";
import * as THREE from "three";

export const Ground = () => {
    const texture = useLoader(THREE.TextureLoader, textureImg);
    const [ref] = usePlane(() => ({
        type: "Static",
        position: [0, -10, 0],
        rotation: [-Math.PI / 2, 0, 0],
    }));

    return (
        <mesh ref={ref} receiveShadow scale={50}>
            <planeBufferGeometry />
            <meshStandardMaterial attach="material" map={texture} />
        </mesh>
    );
};
