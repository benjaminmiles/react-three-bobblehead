import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Model(props) {
  const { nodes, materials } = useGLTF("/bobbledome-transformed.glb");
  return (
    <group {...props} dispose={null}>
      <group scale={3}>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_1237out_Mat4_0002.geometry}>
          <meshStandardMaterial attach='material' {...materials["HAIR.003"]} roughness={1} metalness={0} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_1237out_Mat4_0002_1.geometry}>
          <meshStandardMaterial attach='material' {...materials["Mat.018"]} roughness={0.8} metalness={0} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_1237out_Mat4_0002_2.geometry}>
          <meshStandardMaterial attach='material' {...materials["Mat.017"]} roughness={0.5} metalness={0} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_1237out_Mat4_0002_3.geometry} material={materials["EYE_R.003"]}>
          <meshStandardMaterial attach='material' {...materials["EYE_R.003"]} roughness={1} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/bobbledome-transformed.glb");
