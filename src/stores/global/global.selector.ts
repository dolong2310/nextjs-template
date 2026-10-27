import { useGlobalStore } from "@/stores/global/global.store";

export const useForceLogout = () => {
  return useGlobalStore((state) => state.forceLogout);
};

export const useLoadingGlobal = () => {
  return useGlobalStore((state) => state.loadingGlobal);
};

export const useGlobalStoreActions = () => {
  return useGlobalStore((state) => state.actions);
};
