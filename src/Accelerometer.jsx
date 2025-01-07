import React, { useEffect, useState } from "react";
import { useDetectGPU } from "@react-three/drei";

import { useStore } from "./useStore";

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

export const Accelerometer = ({ movementRatio = 0.1 }) => {
  const { isMobile } = useDetectGPU();

  const { permissionGranted, setPermissionGranted } = useStore(state => ({
    permissionGranted: state.permissionGranted,
    setPermissionGranted: state.setPermissionGranted,
  }));
  const { setPosition } = useStore(state => ({ position: state.position, setPosition: state.setPosition }));

  useEffect(() => {
    const handleMotionEvent = event => {
      const x = event.accelerationIncludingGravity.x;
      const y = event.accelerationIncludingGravity.y;
      const z = event.accelerationIncludingGravity.z;

      const newX = clamp(x * movementRatio, -1.5, 1.5);
      const newY = clamp(y * movementRatio, -0.5, 1.5);
      const newZ = clamp(z * movementRatio, -3, 3);

      setPosition({ x: newX, y: newY, z: newZ });
    };

    if (permissionGranted) {
      window.addEventListener("devicemotion", handleMotionEvent);
    }

    return () => {
      if (permissionGranted) {
        window.removeEventListener("devicemotion", handleMotionEvent);
      }
    };
  }, [permissionGranted]);

  const requestPermission = async () => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === "granted") {
          setPermissionGranted(true);
        }
      } catch (error) {
        console.error("DeviceMotionEvent permission request failed:", error);
      }
    } else {
      setPermissionGranted(true);
    }
  };

  return (
    <div>
      {isMobile && !permissionGranted && (
        <button
          onClick={requestPermission}
          style={{
            position: "absolute",
            left: `50%`,
            bottom: `64px`,
            borderRadius: "45px",
            transform: "translateX(-50%)",
            color: "black",
            background: "white",
            padding: "10px 20px",
            border: "none",
            outline: "none",
            textTransform: "uppercase",
            letterSpacing: "0.05rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Enable Accelerometer
        </button>
      )}
    </div>
  );
};

export default Accelerometer;
