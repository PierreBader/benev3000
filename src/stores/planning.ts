import { defineStore } from 'pinia';
import { Assignation, Benevole, Periode } from 'src/components/models';

export const usePlanningStore = defineStore('planning', {
  state: () => ({
    eventName: '',
    benevoles: [] as Benevole[],
    periodes: [] as Periode[],
    assignations: [] as Assignation[],
  }),

  getters: {
    allPostes: (state) => {
      return [...new Set(state.periodes.flatMap((b) => b.postes))];
    },
    export: (state) => {
      return {
        eventName: state.eventName,
        benevoles: state.benevoles,
        periodes: state.periodes,
        assignations: state.assignations,
      };
    },
  },

  persist: {
    storage: sessionStorage,
  },

  actions: {
    addBenevole() {
      let id = 1;
      if (this.benevoles.length > 0)
        id = this.benevoles.map((b) => b.id).sort((a, b) => b - a)[0] + 1;

      this.benevoles.push({
        id: id,
        name: 'Bénévole ' + id,
        postes: [],
        availability: [],
      });

      return id;
    },

    deleteBenevole(id: number) {
      this.benevoles = this.benevoles.filter((b) => b.id != id);
    },

    addPeriode() {
      let id = 1;
      if (this.periodes.length > 0)
        id = this.periodes.map((b) => b.id).sort((a, b) => b - a)[0] + 1;

      this.periodes.push({
        id: id,
        name: 'Période ' + id,
        creneaux: [],
        postes: [],
      });

      return id;
    },

    deletePeriode(id: number) {
      this.periodes = this.periodes.filter((b) => b.id != id);
    },

    removeAssignation(assignation: Assignation) {
      this.assignations = this.assignations.filter(
        (a) =>
          a.benevole != assignation.benevole ||
          a.periode != assignation.periode ||
          a.creneau != assignation.creneau ||
          a.poste != assignation.poste
      );
    },

    addAssignation(assignation: Assignation) {
      this.assignations.push(assignation);
    },
  },
});
