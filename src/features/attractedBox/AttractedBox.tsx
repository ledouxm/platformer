import { randomForce, speedRef } from "./utils";
import { Triplet, useBox } from "@react-three/cannon";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Cube } from "./AppCanvas";

export const AttractedBox = ({ dest, basePosition, color }: Cube & { speed: number }) => {
    const [ref, api] = useBox(() => ({
        mass: 5,
        linearDamping: 0.95,
        position: basePosition.toArray(),
        angularFactor: [0, 0, 0],
        isTrigger: true,
    }));
    const { camera } = useThree();
    const force = useRef(randomForce(speedRef.current, 10));
    const activeRef = useRef(true);

    useEffect(() => {
        var frustum = new THREE.Frustum();

        camera.updateMatrix();
        camera.updateMatrixWorld();
        frustum.setFromProjectionMatrix(
            new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
        );

        api.position.subscribe((p) => {
            // apply a strength factor
            // Your 3d point to check
            var pos = new THREE.Vector3(...p);
            if (frustum.containsPoint(pos)) {
                activeRef.current = false;
                // Do something with the position...
            } else {
                if (!activeRef.current) {
                    force.current.force = force.current.force.negate();
                }
                activeRef.current = true;
            }
            const forceVec = force.current.force;

            api.applyForce(
                forceVec.toArray().map((val) => val * speedRef.current) as Triplet,
                basePosition.toArray()
            );
        });
    }, []);

    return (
        <mesh ref={ref} renderOrder={5}>
            <boxGeometry />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};
