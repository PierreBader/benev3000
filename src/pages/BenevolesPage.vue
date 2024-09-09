<template>
  <div class="q-pa-md">
    <div class="row item-start">
      <div class="col-4 item-start">
        <q-btn icon="arrow_back" label="Retour" to="/" />
        <q-list>
          <q-item-label header>Bénévoles</q-item-label>
          <BenevoleItem
            v-for="benevole in store.benevoles"
            :key="benevole.id"
            v-bind="benevole"
          />
        </q-list>
        <q-btn
          color="primary"
          icon="person_add"
          label="Nouveau"
          @click="store.addBenevole()"
        />
      </div>
      <div class="col-8 items-center">
        <div v-if="!selected">Sélectionne un bénévole</div>
        <div v-else>
          <div class="q-pa-md">
            <div class="q-gutter-md" style="max-width: 400px">
              <q-input v-model="selected.name" label="Nom" />
              <q-input v-model="selected.email" label="Adresse e-mail" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BenevoleItem from 'src/components/BenevoleItem.vue';
import { usePlanningStore } from 'src/stores/planning';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const store = usePlanningStore();

defineOptions({
  name: 'BenevolesPage',
});

const selected = computed(() => {
  if (!route.params.id) return null;

  const benevoleId = +route.params.id;
  return store.benevoles.find((b) => b.id == benevoleId);
});
</script>
