import { Box } from "@chakra-ui/react";
import { makeArrayOf } from "@pastable/core";
import { Physics } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { Fragment, Suspense, useEffect } from "react";
import { useRef } from "react";
import { AppLight } from "../components/AppLight";
import { Pit } from "../components/Background";
import { Character } from "./character/Character";
import { HexagonGrid } from "./Hexagon";
import { useInputsRef } from "../hooks/useInputsRef";
import { SkyDome } from "@/components/SkyDome";
import { Stars } from "@react-three/drei";
import { Planet } from "./Planet";

const requestPointerLock = () => {
    const canvas = document.body;
    //@ts-ignore
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

    canvas.requestPointerLock();
};

const nbFloors = 5;
const colors = ["#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7"];

export const PlatformerCanvas = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        requestPointerLock();

        document.body.onclick = () => requestPointerLock();
    }, []);

    useInputsRef();

    return (
        <Box>
            <Canvas
                shadows
                style={{
                    height: "100vh",
                    width: "100vw",
                }}
                camera={{ far: 2000 }}
                ref={canvasRef}
            >
                <ambientLight intensity={0.2} />
                <AppLight />

                <Suspense fallback={null}>
                    <SkyDome />
                </Suspense>

                <Planet position={[0, -15, 0]} scale={[10, 10, 10]} />
                <Physics
                    defaultContactMaterial={{
                        restitution: 0,
                        friction: 0,
                    }}
                    gravity={[0, -4 * 9.8, 0]}
                    step={1 / 144}
                    broadphase="Naive"
                >
                    <Pit y={nbFloors * -10 - 10} />
                    <Stars count={1000} radius={70} />
                    {makeArrayOf(nbFloors).map((_, index) => (
                        <Fragment key={index}>
                            <AppLight position={[-40, index * -10 + 7, 0]} />
                            <HexagonGrid y={index * -10} color={colors[index]} />
                        </Fragment>
                    ))}
                    <Character position={[0, 3, 0]} />
                </Physics>
            </Canvas>
        </Box>
    );
};

export const shouldGatherRef = {
    current: false,
};
