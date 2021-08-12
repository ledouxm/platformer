import { getRandomIntIn } from "@pastable/core";
import { nanoid } from "nanoid";
import * as THREE from "three";

export const minSpeed = 1;
export const maxSpeed = 20;
export const speedRef = {
    current: minSpeed,
};

export const randomForce = (multiplier: number, offset: number) => {
    const randomIndex = getRandomIntIn(1, 2);
    let force = [0, 0, 0];
    const random = Math.random() * 4;
    force[randomIndex] =
        random >= 2 ? -(random * multiplier + offset) : random * multiplier + offset;

    return {
        random,
        randomIndex,
        force: new THREE.Vector3(...force),
    };
};

export const recalculateForce = (prevForce: any, multiplier: number, offset: number) => {
    let force = [0, 0, 0];

    force[prevForce.randomIndex] =
        prevForce.random >= 2
            ? -(prevForce.random * multiplier + offset)
            : prevForce.random * multiplier + offset;

    return {
        ...prevForce,
        force: new THREE.Vector3(...force),
    };
};
