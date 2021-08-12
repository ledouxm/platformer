import { Triplet } from "@react-three/cannon";
import { Suspense, useEffect, useRef, useState } from "react";
import { Group, Mesh, MeshBasicMaterial } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export const Planet = ({
    position,
    rotation,
    scale,
}: {
    position?: Triplet;
    rotation?: Triplet;
    scale?: Triplet;
}) => {
    return (
        <Suspense fallback={null}>
            {ObjToPrimitive({
                url: "/assets/planet2.obj",
                matUrl: "/assets/planet2.mtl",
                position,
                rotation,
                scale,
            })}
        </Suspense>
    );
};

const baseMat = new MeshBasicMaterial({ color: "blue" });

export const ObjToPrimitive = ({
    url,
    matUrl,
    position,
    rotation,
    scale,
}: {
    url: string;
    matUrl: string;
    position?: Triplet;
    rotation?: Triplet;
    scale?: Triplet;
}) => {
    const [obj, setObj] = useState<Group>(null);

    const meshRef = useRef<Mesh>(null);

    useEffect(() => {
        new MTLLoader().load(matUrl, (materialCreator) => {
            const loader = new OBJLoader();
            console.log(materialCreator);
            loader.setMaterials(materialCreator);

            loader.load(url, (newObj) => {
                console.log(newObj);
                if (rotation) newObj.rotation.set(...rotation);
                if (position) newObj.position.set(...position);
                if (scale) newObj.scale.set(...scale);

                setObj(newObj);
            });
        });
    }, [url]);

    if (!obj) return null;

    console.log("salut");

    return <primitive ref={meshRef} object={obj} />;
};
