import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { db } from 'src/boot/firebase';
import { Assignation, Benevole, Periode } from 'src/components/models';

export const usePlanningStore = defineStore('planning', {
  state: () => ({
    firebaseId: '',
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
    async initEventSync(eventId: string) {
      const docRef = doc(db, 'events', eventId);
      this.firebaseId = eventId;

      onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          this.eventName = docSnapshot.data().eventName;

          this.benevoles = docSnapshot.data().benevoles;
          this.periodes = docSnapshot.data().periodes;
          this.assignations = docSnapshot.data().assignations;
        }
      });

      try {
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
          this.resetEvent();
        }
      } catch (error) {
        this.resetEvent();
      }
    },

    resetEvent() {
      this.eventName = '';
      this.benevoles = [];
      this.periodes = [];
      this.assignations = [];
    },

    async updateEvent() {
      const docRef = doc(db, 'events', this.firebaseId);

      await updateDoc(docRef, {
        eventName: this.eventName,
        benevoles: this.benevoles,
        periodes: this.periodes,
        assignations: this.assignations,
      });
    },

    async updateBenevoles() {
      const docRef = doc(db, 'events', this.firebaseId);

      await updateDoc(docRef, {
        benevoles: this.benevoles,
      });
    },

    async updatePeriodes() {
      const docRef = doc(db, 'events', this.firebaseId);

      await updateDoc(docRef, {
        periodes: this.periodes,
      });
    },

    async updateAssignations() {
      const docRef = doc(db, 'events', this.firebaseId);

      await updateDoc(docRef, {
        assignations: this.assignations,
      });
    },

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

      this.updateEvent();

      return id;
    },

    deleteBenevole(id: number) {
      this.benevoles = this.benevoles.filter((b) => b.id != id);
      this.updateEvent();
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
      this.updateEvent();

      return id;
    },

    deletePeriode(id: number) {
      this.periodes = this.periodes.filter((b) => b.id != id);
      this.updateEvent();
    },

    removeAssignation(assignation: Assignation) {
      this.assignations = this.assignations.filter(
        (a) =>
          a.benevole != assignation.benevole ||
          a.periode != assignation.periode ||
          a.creneau != assignation.creneau ||
          a.poste != assignation.poste
      );
      this.updateEvent();
    },

    addAssignation(assignation: Assignation) {
      this.assignations.push(assignation);
      this.updateEvent();
    },
  },
});
