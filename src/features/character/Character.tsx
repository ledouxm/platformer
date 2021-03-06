import { Triplet, useBox } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { keyDownRef, keyPressedRef } from "../../hooks/useInputsRef";
import { useMouseMovements } from "../../hooks/useMouseMovement";
import { calculateForce } from "./utils";

const speed = 5;
const jumpForce = 25;
const cameraSensitivity = 20;

export const Character = ({ position }: { position: Triplet }) => {
    const [meshRef, api] = useBox(() => ({
        mass: 10,
        angularFactor: [0, 0, 0],
        linearDamping: 0.99,
        linearFactor: [0.1, 1, 0.1],
        onCollideBegin: (e) => {
            switch (e.body.name) {
                case "pit":
                    api.position.set(0, 5, 0);
            }
            groundedRef.current = true;
        },
        material: {
            restitution: 0,
        },
        position,
    }));

    const { camera } = useThree();

    // Track mouse movements
    const mouseMovementRef = useMouseMovements();

    // Mesh data
    const positionRef = useRef<Triplet>(position);
    const rotationRef = useRef<Triplet>([0, 0, 0]);
    const velocityRef = useRef<Triplet>([0, 0, 0]);
    const groundedRef = useRef(false);

    // Game data
    const isPausedRef = useRef(false);

    useEffect(() => {
        // Store CannonJS data into refs so we can use them in useFrame
        api.position.subscribe((p) => (positionRef.current = p));
        api.rotation.subscribe((r) => (rotationRef.current = r));
        api.velocity.subscribe((r) => (velocityRef.current = r));
    }, []);

    useFrame(({ clock }) => {
        const deltaTime = clock.getDelta();

        const currentRotation = rotationRef.current;

        // KEYBOARD INPUT HANDLERS

        // Go forward
        if (keyDownRef.currents.has("KeyW")) {
            const force = calculateForce(rotationRef.current[1], speed, [-1, 0, 0]);

            velocityRef.current[0] = force.x;
            velocityRef.current[2] = force.z;
        }

        // Go backward
        if (keyDownRef.currents.has("KeyS")) {
            const force = calculateForce(rotationRef.current[1], speed, [0.8, 0, 0]);

            velocityRef.current[0] = force.x;
            velocityRef.current[2] = force.z;
        }

        // Rotate left
        if (keyDownRef.currents.has("KeyA")) {
            currentRotation[1] += 0.02;
        }

        // Rotate right
        if (keyDownRef.currents.has("KeyD")) {
            currentRotation[1] -= 0.02;
        }

        // Jump
        if (keyDownRef.currents.has("Space")) {
            if (groundedRef.current && Math.abs(velocityRef.current[1]) < 0.1) {
                groundedRef.current = false;
                velocityRef.current[1] = jumpForce;
            }
        }

        // Pause
        if (keyPressedRef.currents.has("KeyP")) {
            isPausedRef.current = !isPausedRef.current;

            if (isPausedRef.current) {
                api.mass.set(0);
            } else {
                api.mass.set(10);
            }
        }

        keyPressedRef.currents.clear();

        // Apply rotation
        if (mouseMovementRef.current)
            currentRotation[1] -= mouseMovementRef.current[0] * 0.1 * deltaTime * cameraSensitivity;

        mouseMovementRef.current = [0, 0];

        // Calculate ideal camera position
        const currentPos = new THREE.Vector3(...positionRef.current);

        const relativeCameraOffset = new THREE.Vector3(10, 3, 0);
        const cameraOffset = relativeCameraOffset.applyMatrix4(meshRef.current.matrixWorld);

        // Update mesh velocity and rotation
        api.velocity.set(...velocityRef.current);
        api.rotation.set(...currentRotation);

        // Update camera position and rotation
        camera.position.lerp(cameraOffset, 0.1);
        camera.lookAt(currentPos);
    });

    return (
        <>
            <mesh ref={meshRef} name="character" castShadow>
                <boxGeometry />
                <meshStandardMaterial color="red" />
            </mesh>
        </>
    );
};
