export const Background = () => {
    return (
        <mesh
            position={[-50, 0, 0]}
            receiveShadow
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            scale={500}
        >
            <planeBufferGeometry />
            <meshBasicMaterial attach="material" color="white" />
        </mesh>
    );
};
