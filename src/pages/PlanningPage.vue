<template>
  <div class="q-pa-md">
    <q-input
      v-model="store.eventName"
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
      <q-radio v-model="benevoleId" :val="0" label="Tous" />
      <q-radio
        v-for="benevole in store.benevoles"
        v-model="benevoleId"
        v-bind:key="benevole.id"
        :val="benevole.id"
        :label="benevole.name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlanningStore } from 'src/stores/planning';
import { ref } from 'vue';

const store = usePlanningStore();

defineOptions({
  name: 'PlanningPage',
});

let benevoleId = ref(0);
</script>
