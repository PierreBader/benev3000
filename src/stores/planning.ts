import { defineStore } from 'pinia';
import { Benevole, Periode } from 'src/components/models';

export const usePlanningStore = defineStore('planning', {
  state: () => ({
    eventName: 'Microsihpon #8',
    benevoles: [
      {
        id: 1,
        name: 'Pierre B',
        email: 'pierre.bader@gmail.com',
        postes: ['Montage', 'Logistique', 'Bar', 'Caisse'],
        availability: [
          'Vendredi Matin',
          'Vendredi Après-midi',
          'Samedi 10h-12h',
        ],
      },
      {
        id: 2,
        name: 'Marlène',
        email: 'marlene.fritsch@gmail.com',
        postes: ['Accueil', 'Bar', 'Caisse'],
        availability: [
          'Vendredi Après-midi',
          'Samedi 10h-12h',
          'Samedi 12h-13h',
        ],
      },
    ] as Benevole[],

    periodes: [
      {
        id: 1,
        name: 'Vendredi',
        creneaux: ['Matin', 'Après-midi'],
        postes: ['Montage', 'Accueil'],
      },
      {
        id: 2,
        name: 'Samedi',
        creneaux: ['10h-12h', '12h-13h', '13h-14h', '14h-15h'],
        postes: ['Logistique', 'Bar', 'Caisse', 'Catering'],
      },
    ] as Periode[],
  }),

  getters: {
    allPostes: (state) => {
      return [...new Set(state.periodes.flatMap((b) => b.postes))];
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
        email: 'benevole' + id + '@gmail.com',
        postes: [],
        availability: [],
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
