<template>
  <div class="q-pa-md">
    <div class="row item-start">
      <div class="col-3 item-start">
        <q-btn icon="arrow_back" label="Retour" :to="'/' + store.firebaseId" />
        <q-list>
          <q-item-label header>Liste des périodes</q-item-label>
          <div v-if="store.periodes.length == 0" class="text-italic q-pb-md">
            Ajoute une première période
          </div>
          <q-item
            v-for="periode in store.periodes"
            :key="periode.id"
            clickable
            tag="a"
            :to="'/' + store.firebaseId + '/periodes/' + periode.id"
          >
            <q-item-section>
              <q-item-label>{{
                periode.name || 'Periode ' + periode.id
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn
          color="primary"
          icon="event"
          label="Nouvelle"
          @click="addPeriode"
        />
      </div>
      <div class="col-9 items-center">
        <div v-if="!selected" class="q-pa-md text-subtitle1 text-italic">
          Sélectionne une période
        </div>
        <div v-else class="q-pa-md">
          <div class="text-subtitle1">Détails de la période</div>
          <div class="q-pb-md">
            <q-btn
              color="red"
              icon="event_busy"
              size="md"
              label="Supprimer"
              @click="deletePeriode"
            />
          </div>

          <div class="q-gutter-md" style="max-width: 600px">
            <q-input
              v-model="selected.name"
              label="Nom"
              @blur="store.updatePeriodes()"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>

            <div class="q-pb-md">
              <div class="text-subtitle1">Postes</div>
              <q-chip
                v-for="p in selected.postes"
                :key="p"
                removable
                color="secondary"
                text-color="white"
                @remove="deletePoste(p)"
              >
                {{ p }}
              </q-chip>
              <q-input
                outlined
                v-model="poste"
                color="secondary"
                @keydown.enter="addPoste"
                @blur="addPoste"
                @keydown.delete="deleteLastPoste"
                label="Ajouter des postes"
                hint="Exemples : Montage, Catering..."
              >
              </q-input>
            </div>

            <div class="q-pb-md">
              <div class="text-subtitle1">Créneaux</div>
              <q-chip
                v-for="c in selected.creneaux"
                :key="c"
                removable
                color="accent"
                text-color="white"
                @remove="deleteCreneau(c)"
              >
                {{ c }}
              </q-chip>
              <q-input
                outlined
                v-model="creneau"
                color="accent"
                @keydown.enter="addCreneau"
                @blur="addCreneau"
                @keydown.delete="deleteLastCreneau"
                label="Ajouter des créneaux"
                hint="Exemples : Matin, 13h-14h..."
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
import { useRoute, useRouter } from 'vue-router';
import { format } from 'quasar';
const { capitalize } = format;

const route = useRoute();
const router = useRouter();

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

function addPeriode() {
  const periodeId = store.addPeriode();

  router.replace({ path: '/' + store.firebaseId + '/periodes/' + periodeId });
}

function deletePeriode() {
  if (route.params.id) {
    store.deletePeriode(+route.params.id);
  }

  router.replace({ path: '/' + store.firebaseId + '/periodes' });
}

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

  store.updatePeriodes();
}

function deleteLastPoste() {
  if (poste.value) return;
  if (selected.value?.postes.length == 0) return;
  selected.value?.postes.pop();

  store.updatePeriodes();
}

function deletePoste(poste: string) {
  if (!selected.value) return;
  selected.value.postes = selected.value.postes.filter((p) => p != poste);

  store.updatePeriodes();
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

  store.updatePeriodes();
}

function deleteLastCreneau() {
  if (creneau.value) return;
  if (!selected.value) return;
  if (selected.value.creneaux.length == 0) return;
  selected.value.creneaux.pop();

  store.updatePeriodes();
}

function deleteCreneau(creneau: string) {
  if (!selected.value) return;
  selected.value.creneaux = selected.value.creneaux.filter((c) => c != creneau);

  store.updatePeriodes();
}
</script>
