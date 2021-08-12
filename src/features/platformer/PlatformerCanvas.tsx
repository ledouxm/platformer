import { Box } from "@chakra-ui/react";
import { Physics } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Ground } from "./Background";
import { Character } from "./Character";
import { Hexagon, HexagonGrid } from "./Hexagon";

const requestPointerLock = () => {
    console.log("request");
    const canvas = document.body;
    //@ts-ignore
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

    canvas.requestPointerLock();
};

export const PlatformerCanvas = () => {
    const canvasRef = useRef(null);

    const [status, setStatus] = useState(false);

    useEffect(() => {
        document.addEventListener("pointerlockchange", (event) => {
            setStatus((status) => !status);
        });
        requestPointerLock();

        document.body.onclick = () => requestPointerLock();
    }, []);

    return (
        <Box>
            <Canvas
                style={{
                    height: "100vh",
                    width: "100vw",
                }}
                ref={canvasRef}
            >
                <ambientLight intensity={0.3} />
                <pointLight intensity={0.7} position={[2, 0, 0]} />
                <Physics
                    defaultContactMaterial={{
                        restitution: 0,
                        friction: 0,
                    }}
                    gravity={[0, -4 * 9.8, 0]}
                    step={1 / 60}
                    broadphase="Naive"
                >
                    <HexagonGrid />
                    <Character />
                    <Ground />
                </Physics>
            </Canvas>
        </Box>
    );
};

export const shouldGatherRef = {
    current: false,
};
