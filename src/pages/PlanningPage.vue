<template>
  <div class="q-pa-md">
    <q-input
      v-model="planningStore.eventName"
      stack-label
      style="max-width: 300px"
      label="Planning de l'évenement"
    />

    <div class="q-gutter-sm">
      <q-btn
        color="primary"
        icon="manage_accounts"
        label="Bénévoles"
        to="/benevoles"
      />
      <q-btn
        color="primary"
        icon="edit_calendar"
        label="Périodes"
        to="/periodes"
      />
      <br />
      <q-radio v-model="guiStore.selectedBenevole" val="" label="Tous" />
      <q-radio
        v-for="benevole in planningStore.benevoles"
        v-model="guiStore.selectedBenevole"
        v-bind:key="benevole.id"
        :val="benevole.name"
        :label="benevole.name"
      />
      <div class="row">
        <PlanningPeriode
          v-for="periode in planningStore.periodes"
          :key="periode.id"
          :periode="periode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlanningPeriode from 'src/components/PlanningPeriode.vue';
import { useGuiStore } from 'src/stores/gui';
import { usePlanningStore } from 'src/stores/planning';

const planningStore = usePlanningStore();
const guiStore = useGuiStore();

defineOptions({
  name: 'PlanningPage',
});
</script>
