import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { useRef } from "react";

const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

export const CameraController = () => {
    const { camera, gl } = useThree();

    const mouseRef = useRef([0, 0]);

    // useEffect(() => {
    //     document.addEventListener("mousemove", (event) => {
    //         console.log(event);
    //         mouseRef.current = [event.clientX - windowHalf.x, event.clientY - windowHalf.x];
    //     });
    // }, []);

    // useFrame(({ camera }) => {
    //     let target: any = {};
    //     target.y = (1 - mouseRef.current[0]) * 0.002;
    //     target.x = (1 - mouseRef.current[1]) * 0.002;

    //     const x = camera.rotation.x + 0.05 * (target.x - camera.rotation.x);
    //     const y = camera.rotation.y + 0.05 * (target.y - camera.rotation.y);

    //     // const newRotation = new THREE.Vector3(x, y, camera.rotation.z).multiply()

    //     // camera.lookAt(new THREE.Vector3(0, 0, 0));
    // });

    // useEffect(() => {
    //     const controls = new OrbitControls(camera, gl.domElement);

    //     controls.enablePan = false;
    //     controls.minDistance = 3;
    //     controls.maxDistance = 20;
    //     return () => {
    //         controls.dispose();
    //     };
    // }, [camera, gl]);
    return null;
};
