import { maxSpeed, minSpeed, speedRef } from "./utils";
import { Box, Center } from "@chakra-ui/react";
import { Physics } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
// import TypeWriterEffet from "react-typewriter-effect";
import * as THREE from "three";
import Typewriter from "typewriter-effect/dist/core";

import { Vector3 } from "three";
import { Background } from "./Background";
import { AttractedBox } from "./AttractedBox";
import { letters } from "./letters";
import { CameraController } from "../platformer/CameraController";
import { Character } from "../platformer/Character";

export interface Cube {
    dest: Vector3;
    basePosition: Vector3;
    color: string;
}

const randomPosition = (offset: Vector3) =>
    new THREE.Vector3(-Math.random() * 20 + 10, -Math.random() * 20 + 10, -Math.random() * 20 + 10);

const makeCube = (dest: Vector3, offset: Vector3, color: string) => {
    return {
        dest: dest.add(offset),
        basePosition: randomPosition(offset),
        color,
    };
};

const cubes = letters.flatMap((letter) =>
    letter.cubes.map((cube) => makeCube(new THREE.Vector3(...cube), letter.offset, letter.color))
);

export const getSpeed = (percentage: number) => percentage * (maxSpeed - minSpeed) + minSpeed;

export const AppCanvas = () => {
    const [shouldGather, setShouldGather] = useState(false);
    const [speed, setSpeed] = useState(minSpeed);
    const containerRef = useRef(null);

    useEffect(() => {
        document.body.onscroll = (value) => {
            // console.log(document.body.getBoundingClientRect());
            const { top } = document.body.getBoundingClientRect();

            speedRef.current = getSpeed(-top / document.body.scrollHeight);
            // setSpeed(getSpeed(-top / document.body.scrollHeight));
        };

        new Typewriter("#typewriter", {
            strings: ["CHAINBREAK"],
            autoStart: true,
        });
    }, []);

    useEffect(() => {
        shouldGatherRef.current = shouldGather;
    }, [shouldGather]);

    return (
        <Box
            onClick={() => setShouldGather((current) => !current)}
            overflow="hidden"
            ref={containerRef}
        >
            <Canvas
                style={{
                    height: "100vh",
                    width: "100vw",
                    zIndex: 1,
                    position: "fixed",
                    top: "0",
                    opacity: 0.8,
                }}
                camera={{ fov: 70, position: [15, 0, 0], rotation: [0, 3, 0] }}
            >
                {/* <CameraController /> */}
                <Character />
                <ambientLight intensity={0.3} />
                <pointLight intensity={0.7} position={[5, 0, 0]} />
                <Background />
                <Physics gravity={[0, 0, 0]} iterations={1} broadphase="SAP">
                    {cubes.map((cube, index) => (
                        <AttractedBox {...cube} speed={speed} key={index} />
                    ))}
                </Physics>
            </Canvas>
            <Box
                opacity={0}
                position="relative"
                zIndex="20"
                h="100%"
                color="black"
                bg="rgba(255, 255, 255, .8)"
            >
                <Center h="100vh">
                    <Box id="typewriter" fontWeight="bold" fontSize="100px" />
                </Center>
                <Center h="100vh">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet consequatur
                    reprehenderit, ipsa deleniti quaerat iusto, velit tempora fugit sit laborum
                    illum facilis ex, cum ipsum architecto? Nesciunt molestias obcaecati eaque.
                </Center>
                <Center h="100vh">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet consequatur
                    reprehenderit, ipsa deleniti quaerat iusto, velit tempora fugit sit laborum
                    illum facilis ex, cum ipsum architecto? Nesciunt molestias obcaecati eaque.
                </Center>
                <Center h="100vh">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet consequatur
                    reprehenderit, ipsa deleniti quaerat iusto, velit tempora fugit sit laborum
                    illum facilis ex, cum ipsum architecto? Nesciunt molestias obcaecati eaque.
                </Center>
                <Center h="100vh">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet consequatur
                    reprehenderit, ipsa deleniti quaerat iusto, velit tempora fugit sit laborum
                    illum facilis ex, cum ipsum architecto? Nesciunt molestias obcaecati eaque.
                </Center>
                <Center h="100vh">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet consequatur
                    reprehenderit, ipsa deleniti quaerat iusto, velit tempora fugit sit laborum
                    illum facilis ex, cum ipsum architecto? Nesciunt molestias obcaecati eaque.
                </Center>
                <Center h="100vh">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet consequatur
                    reprehenderit, ipsa deleniti quaerat iusto, velit tempora fugit sit laborum
                    illum facilis ex, cum ipsum architecto? Nesciunt molestias obcaecati eaque.
                </Center>
                <Center h="100vh">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet consequatur
                    reprehenderit, ipsa deleniti quaerat iusto, velit tempora fugit sit laborum
                    illum facilis ex, cum ipsum architecto? Nesciunt molestias obcaecati eaque.
                </Center>
            </Box>
        </Box>
    );
};

export const shouldGatherRef = {
    current: false,
};
