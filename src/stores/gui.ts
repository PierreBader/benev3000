import { defineStore } from 'pinia';
import { usePlanningStore } from './planning';
import { compareSync } from 'bcryptjs';

export const useGuiStore = defineStore('gui', {
  state: () => ({
    selectedBenevole: null,
    selectedPeriode: null,
    selectedPoste: null,
    eventLoaded: false,
    eventPass: '',
  }),

  getters: {
    eventWriteAllowed: (state) => {
      if (!state.eventLoaded) return false;
      const planning = usePlanningStore();
      if (!planning.eventHash) return true;
      return compareSync(state.eventPass, planning.eventHash);
    },
  },
  actions: {},
});
