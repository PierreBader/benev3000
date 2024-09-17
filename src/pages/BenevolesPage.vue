<template>
  <div
    class="q-pa-md"
    v-if="guiStore.eventLoaded && guiStore.eventWriteAllowed"
  >
    <div class="row item-start">
      <div class="col-3 item-start">
        <q-btn
          icon="arrow_back"
          label="Retour"
          :to="'/' + planningStore.firebaseId"
        />
        <q-list>
          <q-item-label header>Liste des bénévoles</q-item-label>
          <div
            v-if="planningStore.benevoles.length == 0"
            class="text-italic q-pb-md"
          >
            Ajoute un premier bénévole
          </div>
          <q-item
            v-for="benevole in planningStore.benevoles"
            :key="benevole.id"
            clickable
            tag="a"
            :to="'/' + planningStore.firebaseId + '/benevoles/' + benevole.id"
          >
            <q-item-section>
              <q-item-label>{{ benevole.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn
          color="primary"
          icon="person_add"
          label="Nouveau"
          class="q-ma-sm"
          @click="addBenevole"
        />
        <br />
        <q-btn
          color="secondary"
          icon="upload"
          label="Importer"
          class="q-ma-sm"
          @click="openImportPopup"
        />
        <q-dialog v-model="isImportPopopOpen" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">
                Contenu de la case A1 de la feuille "Export Benev3000"
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                dense
                type="textarea"
                v-model="importData"
                autofocus
                @keyup.enter="importBenevoles"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Annuler" color="negative" v-close-popup />
              <q-btn
                flat
                label="Importer"
                color="positive"
                @click="importBenevoles"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
      <div class="col-9 items-center">
        <div v-if="!selected" class="q-pa-md text-subtitle1 text-italic">
          Sélectionne un bénévole
        </div>
        <div v-else class="q-pa-md">
          <div class="text-subtitle1">Détails du bénévole</div>
          <div class="q-pb-md">
            <q-btn-group push class="q-mr-md">
              <q-btn
                color="primary"
                icon="file_copy"
                @click="copyBenevole"
                label="Dupliquer"
              />
            </q-btn-group>
            <q-btn
              color="negative"
              icon="person_remove"
              size="md"
              label="Supprimer"
              @click="deleteBenevole"
            />
          </div>

          <div class="q-gutter-md" style="max-width: 400px">
            <q-input
              v-model="selected.name"
              label="Nom"
              @blur="planningStore.updateBenevoles()"
            />

            <q-input
              v-model="selected.email"
              label="Adresse e-mail"
              type="email"
              @blur="planningStore.updateBenevoles()"
            />

            <div class="q-pb-md">
              <div class="text-subtitle1">Postes</div>
              <div class="text-caption">
                Postes où {{ selected.name }} voudrait être assigné
              </div>
              <q-option-group
                v-if="planningStore.allPostes.length > 0"
                color="secondary"
                v-model="selected.postes"
                :options="postOptions"
                @update:model-value="planningStore.updateBenevoles()"
                type="checkbox"
              />
              <div v-else class="text-italic">
                Ajoute un poste dans une période pour l'afficher
              </div>
            </div>

            <div class="q-pb-md">
              <div class="text-subtitle1">Disponibilités</div>
              <div class="text-caption">
                Créneaux où {{ selected.name }} est disponible
              </div>
              <q-tree
                v-if="planningStore.periodes.length > 0"
                class="col-12 col-sm-6"
                :nodes="creneauxNodes"
                node-key="label"
                tick-strategy="leaf"
                v-model:ticked="selected.availability"
                default-expand-all
                color="accent"
                @update:ticked="planningStore.updateBenevoles()"
              />
              <div v-else class="text-italic">
                Ajoute une période avec des créneaux pour les afficher
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Benevole } from 'src/components/models';
import { useGuiStore } from 'src/stores/gui';
import { usePlanningStore } from 'src/stores/planning';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const planningStore = usePlanningStore();
const guiStore = useGuiStore();

const isImportPopopOpen = ref(false);
const importData = ref('');

defineOptions({
  name: 'BenevolesPage',
});

const selected = computed(() => {
  if (!route.params.id) return null;

  const benevoleId = +route.params.id;
  return planningStore.benevoles.find((b) => b.id == benevoleId);
});

const postOptions = computed(() => {
  if (planningStore.allPostes.length === 0) return [];
  return planningStore.allPostes.map((p) => {
    return {
      label: p!,
      value: p!,
    };
  });
});

const creneauxNodes = computed(() => {
  return planningStore.periodes.map((p) => {
    return {
      label: p.name,
      children: p.creneaux.map((c) => {
        return { label: p.name + ' ' + c };
      }),
    };
  });
});

function addBenevole() {
  const benevoleId = planningStore.addBenevole();

  router.replace({
    path: '/' + planningStore.firebaseId + '/benevoles/' + benevoleId,
  });

  planningStore.updateBenevoles();
}

function copyBenevole() {
  if (!route.params.id) return null;
  const benevoleId = +route.params.id;
  const current: Benevole = planningStore.benevoles.find(
    (b) => b.id == benevoleId
  )!;

  const newBenevoleId = planningStore.copyBenevole(current);

  router.replace({
    path: '/' + planningStore.firebaseId + '/benevoles/' + newBenevoleId,
  });
}

function deleteBenevole() {
  if (route.params.id) {
    planningStore.deleteBenevole(+route.params.id);
  }

  router.replace({ path: '/' + planningStore.firebaseId + '/benevoles' });

  planningStore.updateBenevoles();
}

function openImportPopup() {
  importData.value = '';
  isImportPopopOpen.value = true;
}

function importBenevoles() {
  const sanitizedJson = importData.value
    .replaceAll('""', '"')
    .replaceAll('"[', '[')
    .replaceAll(']"', ']');
  try {
    const data: Benevole[] = JSON.parse(sanitizedJson);

    data.forEach((line) => {
      importBenevole(line);
    });

    isImportPopopOpen.value = false;
  } catch (error) {
    console.error(error);
  }
}

function importBenevole(bevenoleData: Benevole) {
  const existingBenevole = planningStore.benevoles.find(
    (b) => b.email == bevenoleData.email
  );
  if (existingBenevole) {
    existingBenevole.availability = bevenoleData.availability;
    existingBenevole.postes = bevenoleData.postes;
  } else {
    planningStore.importBenevole(bevenoleData);
  }
}
</script>
