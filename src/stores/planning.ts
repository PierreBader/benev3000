import { defineStore } from 'pinia';
import { Benevole, Periode } from 'src/components/models';

export const usePlanningStore = defineStore('planning', {
  state: () => ({
    eventName: '',
    benevoles: [
      {
        id: 1,
        name: 'Pierre B',
        email: 'pierre.bader@gmail.com',
      },
    ] as Benevole[],

    periodes: [
      {
        id: 1,
        name: 'Vendredi',
        creneaux: [
          {
            id: 1,
            name: 'Matin',
          },
          {
            id: 2,
            name: 'Après-midi',
          },
        ],
        postes: ['Montage', 'Accueil'],
      },
    ] as Periode[],
  }),

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
        email: 'benevole' + id + '@gmail.com',
      });
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
    },
  },
});
