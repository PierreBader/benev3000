<template>
  <div class="q-pa-md">
    <div class="row item-start">
      <div class="col-4 item-start">
        <q-btn icon="arrow_back" label="Retour" to="/" />
        <br />
        <q-list>
          <q-item-label header>Périodes</q-item-label>
          <PeriodeItem
            v-for="periode in store.periodes"
            :key="periode.id"
            v-bind="periode"
          />
        </q-list>
        <q-btn
          color="primary"
          icon="event_upcoming"
          label="Nouvelle"
          @click="store.addPeriode()"
        />
      </div>
      <div class="col-8 items-center">
        <div v-if="!selected">Sélectionne une période</div>
        <div v-else>
          {{ selected.name }}

          <div class="q-pa-md">
            <div class="q-gutter-md" style="max-width: 600px">
              <q-input v-model="selected.name" label="Nom" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PeriodeItem from 'src/components/PeriodeItem.vue';
import { usePlanningStore } from 'src/stores/planning';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const store = usePlanningStore();

defineOptions({
  name: 'PeriodesPage',
});

const selected = computed(() => {
  if (!route.params.id) return null;

  const periodeId = +route.params.id;
  return store.periodes.find((p) => p.id == periodeId);
});
</script>
