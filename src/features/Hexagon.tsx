import { getSaturedColor } from "@/utils";
import { makeArrayOf } from "@pastable/react/node_modules/@pastable/utils";
import { useCylinder } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { MeshProps } from "@react-three/fiber";
import { nanoid } from "nanoid";
import { useRef } from "react";
import { Color, MeshStandardMaterial, Vector3 } from "three";

const factor = 0.8660254;

const parentSize = 2.15;
const parentHeight = parentSize * 2 * factor;

const size = 2;
const characterSize = 1;

const disappearDelay = 1000;

const hexagonsPerRow = [3, 6, 9, 10, 11, 10, 11, 10, 9, 6, 3];

const zOffset = ((hexagonsPerRow.length - 1) * Math.sqrt(3) * (parentHeight / 2)) / 2;

const makeRow = (nb: number, index: number) => {
    const hexagons = makeArrayOf(nb).map((_, subIndex) => ({
        x: subIndex * parentHeight,
        id: nanoid(12),
        z: index * Math.sqrt(3) * (parentHeight / 2) - zOffset,
    }));
    const avgX =
        hexagons.reduce((acc, current) => acc + current.x, 0) / hexagons.length +
        parentSize / 2 +
        characterSize / 2;

    return hexagons.map((hexa) => ({ ...hexa, x: hexa.x - avgX }));
};

export const HexagonGrid = ({ y, color = "blue" }: { y: number; color: string }) => {
    return (
        <>
            {hexagonsPerRow.flatMap((nb, index) =>
                makeRow(nb, index).map(({ x, z, id }, subIndex) => {
                    const newColor =
                        Math.random() > 0.5 ? new Color(color) : getSaturedColor(color);
                    return (
                        <Hexagon
                            key={id}
                            color={newColor}
                            position={[x, y, z]}
                            isCenter={
                                index === Math.floor(hexagonsPerRow.length / 2) &&
                                subIndex === Math.floor(nb / 2)
                            }
                        />
                    );
                })
            )}
        </>
    );
};

export const Hexagon = ({
    position,
    color,
    isCenter,
    ...props
}: MeshProps & { isCenter: boolean; color: Color | string }) => {
    const args = [size, size, 0.5, 6] as any;

    const statusRef = useRef("idle");
    const materialRef = useRef<MeshStandardMaterial>(null);

    const [ref, api] = useCylinder(() => ({
        type: "Static",
        //@ts-ignore
        position: position,
        onCollide: (e) => {
            const status = statusRef.current;
            if (status === "idle") {
                statusRef.current = "disappearing";

                setTimeout(() => {
                    statusRef.current = "destroyed";

                    api.isTrigger.set(true);
                    if (!materialRef.current) return;
                    materialRef.current.visible = false;
                    // api.collisionResponse.set(0);
                }, disappearDelay);
            }
        },
        args,
    }));

    useFrame(() => {
        if (statusRef.current === "disappearing") {
            const dest = new Vector3(position[0], position[1] - 0.2, position[2]);
            const lerped = ref.current.position.lerp(dest, 0.05);

            materialRef.current.color.lerp(new Color("orange"), 0.05);
            api.position.set(...lerped.toArray());
        }
    });

    if (status === "destroyed") return null;

    return (
        <mesh ref={ref} {...props} receiveShadow castShadow>
            <cylinderGeometry args={args} />
            <meshStandardMaterial ref={materialRef} color={color} />
        </mesh>
    );
};
