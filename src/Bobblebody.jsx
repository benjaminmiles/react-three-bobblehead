import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Model(props) {
  const { nodes, materials } = useGLTF("/bobblebody-transformed.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.neck.geometry}
        material={materials["Mat.012"]}
        position={[0, 0.966, -0.012]}
        scale={1.009}
      />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_1239out_SHOE_R_0.geometry} material={materials.SHOE_R} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_1241out_Mat1_0.geometry} material={materials["Mat.1"]} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_1242out_Tex_0097_0dds_0.geometry} material={materials["Tex_0097_0.dds"]} />
    </group>
  );
}

useGLTF.preload("/bobblebody-transformed.glb");
