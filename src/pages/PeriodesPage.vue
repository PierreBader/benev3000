<template>
  <div class="q-pa-md">
    <div class="row item-start">
      <div class="col-3 item-start">
        <q-btn icon="arrow_back" label="Retour" to="/" />
        <br />
        <q-list>
          <q-item-label header>Périodes</q-item-label>

          <q-item
            v-for="periode in store.periodes"
            :key="periode.id"
            clickable
            tag="a"
            :to="'/periodes/' + periode.id"
          >
            <q-item-section>
              <q-item-label>{{ periode.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn
          color="primary"
          icon="date_range"
          label="Nouvelle"
          @click="store.addPeriode()"
        />
      </div>
      <div class="col-9 items-center">
        <div v-if="!selected">Sélectionne une période</div>
        <div v-else>
          Détails de la période
          <div class="q-pa-md">
            <div class="q-gutter-md" style="max-width: 600px">
              <q-input v-model="selected.name" label="Nom" />

              <q-chip
                v-for="p in selected.postes"
                :key="p"
                removable
                color="primary"
                text-color="white"
                @remove="deletePoste(p)"
              >
                {{ p }}
              </q-chip>
              <q-input
                outlined
                v-model="poste"
                @keydown.enter="addPoste"
                @keydown.delete="deleteLastPoste"
                hint="Séparer les postes par une espace pour en ajouter plusieurs"
                label="Ajouter des postes"
              >
              </q-input>

              <q-chip
                v-for="c in selected.creneaux"
                :key="c"
                removable
                color="teal"
                text-color="white"
                @remove="deleteCreneau(c)"
              >
                {{ c }}
              </q-chip>
              <q-input
                outlined
                v-model="creneau"
                @keydown.enter="addCreneau"
                @keydown.delete="deleteLastCreneau"
                label="Ajouter des créneaux"
                hint="Séparer les créneaux par une espace pour en ajouter plusieurs"
              >
              </q-input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlanningStore } from 'src/stores/planning';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'quasar';
const { capitalize } = format;

const route = useRoute();

const store = usePlanningStore();

defineOptions({
  name: 'PeriodesPage',
});

const poste = ref('');
const creneau = ref('');

const selected = computed(() => {
  if (!route.params.id) return null;

  const periodeId = +route.params.id;
  return store.periodes.find((p) => p.id == periodeId);
});

function addPoste() {
  poste.value
    .split(' ')
    .map((s) => s.trim())
    .map((s) => capitalize(s))
    .forEach((toInsert) => {
      if (toInsert && !selected.value?.postes.includes(toInsert))
        selected.value?.postes.push(toInsert);
    });

  poste.value = '';
}

function deleteLastPoste() {
  if (poste.value) return;
  if (selected.value?.postes.length == 0) return;
  selected.value?.postes.pop();
}

function deletePoste(poste: string) {
  if (!selected.value) return;
  selected.value.postes = selected.value.postes.filter((p) => p != poste);
}

function addCreneau() {
  creneau.value
    .split(' ')
    .map((s) => s.trim())
    .forEach((c) => {
      if (c && !selected.value?.creneaux.includes(c))
        selected.value?.creneaux.push(c);
    });

  creneau.value = '';
}

function deleteLastCreneau() {
  if (creneau.value) return;
  if (!selected.value) return;
  if (selected.value.creneaux.length == 0) return;
  selected.value.creneaux.pop();
}

function deleteCreneau(creneau: string) {
  if (!selected.value) return;
  selected.value.creneaux = selected.value.creneaux.filter((c) => c != creneau);
}
</script>
