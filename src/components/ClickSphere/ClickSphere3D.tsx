import * as THREE from 'three'
import { type FC, memo, useCallback, useRef } from 'react'
// import styles from './ClickSphere3D.module.scss'
import { Canvas, type ThreeElements, useFrame } from "@react-three/fiber";

interface ClickSphere3DProps {
    onClick: () => void
    size?: number
    disabled?: boolean
}

type SphereProps = ThreeElements['mesh'] & {
    onClick: () => void;
    disabled?: boolean;
}

const Sphere: FC<SphereProps> = ({ onClick, disabled }) => {
    const sphereMeshRef = useRef<THREE.Mesh>(null!)

    const handleClick = useCallback(() => {
        if (disabled) return;
        onClick();
    }, [onClick, disabled])

    useFrame((_, delta) => (sphereMeshRef.current.rotation.y += delta));
    return (
        <mesh
            ref={sphereMeshRef}
            onClick={handleClick}
        >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
                color="hotpink"
                wireframe={true}
            />
        </mesh>
    )
}

export const ClickSphere3D = memo(function ClickSphere3D({
    onClick,
    size = 260,
    disabled = false
}: ClickSphere3DProps) {
    return (
        <>
            <Canvas>
                <ambientLight intensity={Math.PI / 2}/>
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
                <Sphere onClick={onClick} disabled={disabled} />
            </Canvas>
            {/*<div*/}
            {/*    className={`${styles.container} ${disabled ? styles.disabled : ''}`}*/}
            {/*    style={{*/}
            {/*      width: `${size}px`,*/}
            {/*      height: `${size}px`,*/}
            {/*    }}*/}
            {/*    onClick={handleClick}*/}
            {/*>*/}
            {/*  /!* Внешнее свечение *!/*/}
            {/*  <div*/}
            {/*      className={styles.glow}*/}
            {/*      style={{*/}
            {/*        width: `${size * 1.2}px`,*/}
            {/*        height: `${size * 1.2}px`,*/}
            {/*      }}*/}
            {/*  />*/}

            {/*  /!* Основная сфера *!/*/}
            {/*  <div*/}
            {/*      className={styles.sphere}*/}
            {/*      style={{*/}
            {/*        width: `${size}px`,*/}
            {/*        height: `${size}px`,*/}
            {/*      }}*/}
            {/*  />*/}
            {/*</div>*/}
        </>
    )
})