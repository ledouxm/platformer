import { makeArrayOf } from "@pastable/react/node_modules/@pastable/utils";
import { useCylinder } from "@react-three/cannon";
import { MeshProps } from "@react-three/fiber";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

const size = 2;
const factor = 0.8660254;

const gap = 0.2;

const height = size * 2 * factor;

const hexagonsPerRow = [1, 4, 5, 6, 9, 6, 5, 4, 1];

const makeRow = (nb: number, offset: number = 0) => {
    const hexagons = makeArrayOf(nb).map((_, index) => ({
        x: offset + index * (height + gap),
        id: nanoid(12),
    }));
    return hexagons;
};

const getHeight = (nb: number) => {
    return (-nb * height) / 2;
};

export const HexagonGrid = () => {
    return (
        <>
            {hexagonsPerRow.flatMap((nb, index) =>
                makeRow(nb, getHeight(nb)).map(({ x, id }) => (
                    <Hexagon
                        key={id}
                        position={[x, -10, 5 + gap * index + (index * Math.sqrt(3) * height) / 2]}
                    />
                ))
            )}
        </>
    );
};

export const Hexagon = ({ position, ...props }: MeshProps) => {
    const args = [size, size, 0.5, 6];

    const [ref] = useCylinder(() => ({
        type: "Static",
        position: position,
        args,
    }));

    // useEffect(() => {
    //     const cylinder = new THREE.CylinderGeometry(1, 1, 0.5, 6);
    //     // cylinder.
    // }, []);
    return (
        <mesh ref={ref} {...props} receiveShadow>
            <cylinderGeometry args={args} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
};