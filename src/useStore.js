import { create } from "zustand";

export const useStore = create((set) => ({
  position: [0, 0, 0],
  permissionGranted: false,
  setPosition: (position) => set({ position }),
  setPermissionGranted: (permissionGranted) => set({ permissionGranted }),
}));

export default useStore;