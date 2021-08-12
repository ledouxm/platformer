import { Triplet, useBox } from "@react-three/cannon";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

extend({ PointerLockControls });

const speed = 5;
const jumpForce = 20;
const cameraSensitivity = 5;

const keyDownRef = {
    currents: new Set(),
};

export const Character = () => {
    const [meshRef, api] = useBox(() => ({
        mass: 10,
        angularFactor: [0, 0, 0],
        linearDamping: 0.99,
        linearFactor: [0.1, 1, 0.1],
        onCollideBegin: () => {
            groundedRef.current = true;
        },
        material: {
            restitution: 0,
        },
    }));

    const positionRef = useRef<Triplet>([0, 0, 0]);
    const rotationRef = useRef<Triplet>([0, 0, 0]);
    const velocityRef = useRef<Triplet>([0, 0, 0]);

    const groundedRef = useRef(false);

    const mouseRef = useRef([0, 0]);
    const { camera } = useThree();

    useEffect(() => {
        document.body.addEventListener("mousemove", (event) => {
            // console.log(event);
            mouseRef.current = [event.movementX, event.movementY];
        });

        document.onkeydown = (event) => {
            keyDownRef.currents.add(event.code);
        };

        document.onkeyup = (event) => {
            keyDownRef.currents.delete(event.code);
        };

        api.position.subscribe((p) => {
            positionRef.current = p;
        });

        api.rotation.subscribe((r) => (rotationRef.current = r));
        api.velocity.subscribe((r) => (velocityRef.current = r));
    }, [api]);

    useFrame(() => {
        const currentRotation = rotationRef.current;

        if (keyDownRef.currents.has("KeyW")) {
            // store character rotation
            const rotationVector = new THREE.Vector3(...rotationRef.current);

            // define new force on X axis with a speed multiplier
            const force = new THREE.Vector3(-1, 0, 0).multiplyScalar(speed);

            const axis = new THREE.Vector3(0, 1, 0);
            const angle = rotationVector.y;

            force.applyAxisAngle(axis, angle);

            velocityRef.current[0] = force.x;
            velocityRef.current[2] = force.z;
        }

        if (keyDownRef.currents.has("KeyS")) {
            api.applyForce([-200, 0, 0], meshRef.current.position.toArray());
        }

        if (keyDownRef.currents.has("KeyA")) {
            currentRotation[1] += 0.02;
        }

        if (keyDownRef.currents.has("KeyD")) {
            currentRotation[1] -= 0.02;
        }

        if (keyDownRef.currents.has("Space")) {
            if (groundedRef.current && Math.abs(velocityRef.current[1]) < 0.5) {
                groundedRef.current = false;
                velocityRef.current[1] = jumpForce;
            }
        }

        const currentPos = new THREE.Vector3(...positionRef.current);

        const relativeCameraOffset = new THREE.Vector3(10, 3, 0);
        const cameraOffset = relativeCameraOffset.applyMatrix4(meshRef.current.matrixWorld);

        camera.position.lerp(cameraOffset, 0.05);

        if (mouseRef.current) currentRotation[1] -= mouseRef.current[0] * 0.001 * cameraSensitivity;

        api.rotation.set(...currentRotation);
        api.velocity.set(...velocityRef.current);

        mouseRef.current = null;

        camera.lookAt(currentPos);
    });

    return (
        <>
            <mesh ref={meshRef}>
                <boxGeometry />
                <meshStandardMaterial color="red" />
            </mesh>
        </>
    );
};
