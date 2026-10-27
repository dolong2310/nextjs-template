import { create } from "zustand";

interface GlobalState {
  forceLogout: boolean;
  loadingGlobal: boolean;
  actions: {
    setForceLogout: (state: boolean) => void;
    setLoadingGlobal: (state: boolean) => void;
  };
}

export const useGlobalStore = create<GlobalState>()((set) => ({
  forceLogout: false,
  loadingGlobal: false,

  actions: {
    setForceLogout: (state) => {
      set({
        forceLogout: state,
      });
    },
    setLoadingGlobal: (state) => {
      set({
        loadingGlobal: state,
      });
    },
  },
}));
