<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <div class="text-h4">
        Planning de
        <span class="cursor-pointer">
          {{ planningStore.eventName || "l'évenement" }}
          <q-icon name="edit" class="print-hide" size="sm" />
          <q-popup-edit
            v-model="planningStore.eventName"
            auto-save
            v-slot="scope"
          >
            <q-input
              v-model="scope.value"
              autofocus
              @keyup.enter="
                scope.set();
                planningStore.updateEvent();
              "
            />
          </q-popup-edit>
        </span>
        <span v-if="guiStore.selectedBenevole" class="print-only">
          pour {{ guiStore.selectedBenevole }}
        </span>
      </div>
      <div class="print-hide">
        <q-btn-group push class="q-mr-md">
          <q-btn
            color="primary"
            icon="edit_calendar"
            label="Périodes"
            :to="'/' + planningStore.firebaseId + '/periodes'"
          />
          <q-btn
            color="primary"
            icon="manage_accounts"
            label="Bénévoles"
            :to="'/' + planningStore.firebaseId + '/benevoles'"
          />
        </q-btn-group>
        <q-btn-group>
          <q-btn color="primary" outline icon="upload" label="Importer" />
          <q-btn
            color="primary"
            outline
            icon="download"
            label="Exporter"
            @click="saveFile"
          />
        </q-btn-group>
      </div>

      <div
        class="q-ma-md print-hide text-italic text-subtitle1"
        v-if="
          (!planningStore.benevoles || planningStore.benevoles.length == 0) &&
          (!planningStore.periodes || planningStore.periodes.length == 0)
        "
      >
        C'est vide ici ! Ajoute des périodes et des bénévoles pour construire le
        planning
      </div>

      <div
        class="q-pb-md print-hide"
        v-if="planningStore.benevoles && planningStore.benevoles.length > 0"
      >
        <div class="text-subtitle1">Bénévole</div>
        <q-radio v-model="guiStore.selectedBenevole" val="" label="Tous" />
        <q-radio
          v-for="benevole in planningStore.benevoles"
          v-model="guiStore.selectedBenevole"
          v-bind:key="benevole.id"
          :val="benevole.name"
          :label="benevole.name"
        />
      </div>
      <div
        class="q-pb-md print-hide text-italic text-subtitle1"
        v-else-if="planningStore.periodes && planningStore.periodes.length > 0"
      >
        Aucun bénévole
      </div>

      <div
        class="row"
        v-if="planningStore.periodes && planningStore.periodes.length > 0"
      >
        <PlanningPeriode
          v-for="periode in planningStore.periodes"
          :key="periode.id"
          :periode="periode"
        />
      </div>
      <div
        class="q-pb-md print-hide text-italic text-subtitle1"
        v-else-if="
          planningStore.benevoles && planningStore.benevoles.length > 0
        "
      >
        Aucune période
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlanningPeriode from 'src/components/PlanningPeriode.vue';
import { useGuiStore } from 'src/stores/gui';
import { usePlanningStore } from 'src/stores/planning';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const planningStore = usePlanningStore();
const guiStore = useGuiStore();
const route = useRoute();

defineOptions({
  name: 'PlanningPage',
});

function saveFile() {
  const data = JSON.stringify(planningStore.export);
  const blob = new Blob([data], { type: 'application/b3k' });
  const link = document.createElement('a');

  if (planningStore.eventName) {
    link.download = planningStore.eventName + '.b3k';
  } else {
    link.download = 'event.b3k';
  }
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}

onMounted(() => {
  syncEvent();
});

watch(
  () => route.params.eventId,
  () => {
    syncEvent();
  }
);

function syncEvent() {
  if (!route.params.eventId) return;

  let eventId =
    typeof route.params.eventId == 'string'
      ? route.params.eventId
      : route.params.eventId[0];

  planningStore.initEventSync(eventId);
}
</script>
