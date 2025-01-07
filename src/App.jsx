import React, { useRef, forwardRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, SoftShadows, Cylinder, Backdrop, OrbitControls, TransformControls } from "@react-three/drei";
import { Physics, RigidBody, useSpringJoint, BallCollider } from "@react-three/rapier";
import { useControls, button, Leva } from "leva";
import { Vector3, Quaternion } from "three";
import { useDetectGPU } from "@react-three/drei";

import { Model as Bobbledome } from "./Bobbledome";
import { Model as Bobblebody } from "./Bobblebody";
import { Accelerometer } from "./Accelerometer";
import { useStore } from "./useStore";

const Body = forwardRef((props, ref) => {
  return (
    <RigidBody ref={ref} ccd canSleep={false} colliders={false} type='kinematicPosition' {...props}>
      <group position={[0, 0.14, 0]}>
        <Cylinder args={[0.53, 0.53, 0.1]} position={[0, -0.19, 0]} receiveShadow castShadow>
          <meshStandardMaterial attach='material' color='gold' metalness={0.8} roughness={0.7} />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, 0.2]} position={[0, -0.34, 0]} receiveShadow castShadow>
          <meshStandardMaterial attach='material' color='gold' metalness={0.9} roughness={0.9} />
        </Cylinder>
        <Cylinder args={[0.53, 0.53, 0.1]} position={[0, -0.49, 0]} receiveShadow castShadow>
          <meshStandardMaterial attach='material' color='gold' metalness={0.8} roughness={0.7} />
        </Cylinder>
      </group>
      <Bobblebody />
    </RigidBody>
  );
});

const Dome = forwardRef((props, ref) => {
  const { isMobile } = useDetectGPU();

  const { density, linearDamping } = useControls("Physics", {
    density: { value: 100, min: 0, max: 500, label: "Density" },
    linearDamping: { value: isMobile ? 10 : 5, min: 0, max: 100, label: "Damping" },
  });

  return (
    <RigidBody ref={ref} density={density} colliders={false} ccd canSleep={false} linearDamping={linearDamping} {...props}>
      <Bobbledome />
      <BallCollider args={[0.1]} position={[0, 0, 0]} />
    </RigidBody>
  );
});

const Bobblehead = ({ mass = 10, damping = 0.5, springRestLength = 0, stiffness = 1, ...props }) => {
  const { position, permissionGranted } = useStore(state => ({
    position: state.position,
    permissionGranted: state.permissionGranted,
  }));

  const groupRef = useRef();
  const bodyRef = useRef();
  const domeRef = useRef();

  const positionManager = useMemo(() => ({ current: new Vector3(), target: new Vector3(), quaternion: new Quaternion() }), []);

  const stiffnessComputed = useMemo(() => {
    return stiffness * 1.0e3;
  }, [stiffness]);

  useSpringJoint(bodyRef, domeRef, [[0, 1.3, 0.1], [0, 0, 0], springRestLength, stiffnessComputed, damping]);

  const bobble = (x = 0, y = 0, z = 0) => {
    if (domeRef.current) {
      console.log("bobble");
      domeRef.current.applyImpulse({ x, y, z }, true);
    }
  };

  const { xPosition, yPosition, zPosition } = useControls("Physics", {
    xPosition: { value: 0, min: -1.5, max: 1.5, label: "X Position" },
    yPosition: { value: -0.5, min: -0.5, max: 1.5, label: "Y Position" },
    zPosition: { value: 0, min: -1.5, max: 1.5, label: "Z Position" },
  });

  const { bobbleForce } = useControls("Bobbling", {
    bobbleForce: { value: 7, min: 0, max: 50, label: "Strength" },
  });

  useControls(
    "Bobbling",
    {
      "Bobble X": button(() => {
        bobble(-bobbleForce);
      }),
      "Bobble Z": button(() => {
        bobble(0, 0, bobbleForce);
      }),
      "Random Bobble": button(() => {
        bobble(Math.random() * (bobbleForce * 3) - bobbleForce, 0, Math.random() * (bobbleForce * 3) - bobbleForce);
      }),
    },
    [bobbleForce]
  );

  useFrame(() => {
    if (bodyRef.current) {
      if (permissionGranted && position?.x && position?.y && position?.z) {
        positionManager.target.set(position.x, position.y, position.z);
      } else {
        positionManager.target.set(xPosition, yPosition, zPosition);
      }

      // Set next position
      positionManager.current.lerp(positionManager.target, 0.5);
      bodyRef.current.setTranslation({ x: positionManager.current.x, y: positionManager.current.y, z: positionManager.current.z }, true);

      // Set next rotation
      // positionManager.quaternion.setFromEuler({ x: positionManager.current.x, y: positionManager.current.y, z: positionManager.current.z });
      // bodyRef.current.setRotation(positionManager.quaternion, true);
    }
  });

  useEffect(() => {
    if (domeRef.current && bodyRef.current) {
      domeRef.current.setTranslation({ x: 0, y: 1.3, z: 0 }, true);
    }
  }, []);

  return (
    <group ref={groupRef} rotation={[0, -0.5, 0]} {...props}>
      <Body ref={bodyRef} position={[0, 0, 1]} />
      <Dome ref={domeRef} position={[0, 0, 0]} />
    </group>
  );
};

const Scene = ({ debug }) => {
  const { xDirection, yDirection, zDirection, intensity } = useControls(
    "Lighting",
    {
      xDirection: { value: -3, min: -50, max: 50, label: "X Position" },
      yDirection: { value: 27, min: -50, max: 50, label: "Y Position" },
      zDirection: { value: 2, min: -50, max: 50, label: "Z Position" },
      intensity: { value: 3, min: 0, max: 15, label: "Intensity" },
    },
    { collapsed: true }
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <Environment preset='city' environmentIntensity={1} />
      <directionalLight position={[xDirection, yDirection, zDirection]} castShadow shadow-mapSize={2048} intensity={intensity} />
      <Backdrop receiveShadow scale={[30, 8, 3]} floor={4} position={[0, -0.92, -2]}>
        <meshPhysicalMaterial roughness={1} color='teal' />
      </Backdrop>

      <Physics debug={debug}>
        <Bobblehead />
      </Physics>

      <SoftShadows />

      {debug && <OrbitControls makeDefault />}
    </>
  );
};

const App = () => {
  const { isMobile } = useDetectGPU();
  const [debug, setDebug] = useState(false);

  useControls(
    "Debug Mode",
    {
      "Toggle Helpers": button(() => {
        setDebug(!debug);
      }),
    },
    [debug]
  );

  return (
    <>
      <Canvas shadows camera={{ fov: 45, position: [0, 1.5, 6] }}>
        <Scene debug={debug} />
      </Canvas>
      <Accelerometer />
      <Leva collapsed={isMobile} />
    </>
  );
};

export default App;
