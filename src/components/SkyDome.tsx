import { useLoader } from "@react-three/fiber";
import { BackSide, TextureLoader } from "three";
import textureImg from "/assets/sky3.jpg";

export const SkyDome = () => {
    // const texture = useLoader(TextureLoader, textureImg);

    return (
        <mesh>
            <sphereBufferGeometry attach="geometry" args={[200, 60, 40]} />
            <meshBasicMaterial attach="material" color={"black"} side={BackSide} />
        </mesh>
    );
};
