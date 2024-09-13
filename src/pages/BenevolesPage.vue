<template>
  <div class="q-pa-md">
    <div class="row item-start">
      <div class="col-3 item-start">
        <q-btn icon="arrow_back" label="Retour" to="/" />
        <q-list>
          <q-item-label header>Liste des bénévoles</q-item-label>
          <div v-if="store.benevoles.length == 0" class="text-italic q-pb-md">
            Ajoute un premier bénévole
          </div>
          <q-item
            v-for="benevole in store.benevoles"
            :key="benevole.id"
            clickable
            tag="a"
            :to="'/benevoles/' + benevole.id"
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
          @click="addBenevole"
        />
      </div>
      <div class="col-9 items-center">
        <div v-if="!selected" class="q-pa-md text-subtitle1 text-italic">
          Sélectionne un bénévole
        </div>
        <div v-else class="q-pa-md">
          <div class="text-subtitle1">Détails du bénévole</div>
          <div class="q-pb-md">
            <q-btn
              color="red"
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
              @blur="store.updateBenevoles()"
            />

            <div class="q-pb-md">
              <div class="text-subtitle1">Postes</div>
              <div class="text-caption">
                Postes où {{ selected.name }} voudrait être assigné
              </div>
              <q-option-group
                v-if="store.allPostes.length > 0"
                color="secondary"
                v-model="selected.postes"
                :options="postOptions"
                @update:model-value="store.updateBenevoles()"
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
                v-if="store.periodes.length > 0"
                class="col-12 col-sm-6"
                :nodes="creneauxNodes"
                node-key="label"
                tick-strategy="leaf"
                v-model:ticked="selected.availability"
                default-expand-all
                color="accent"
                @update:ticked="store.updateBenevoles()"
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
import { usePlanningStore } from 'src/stores/planning';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const store = usePlanningStore();

defineOptions({
  name: 'BenevolesPage',
});

const selected = computed(() => {
  if (!route.params.id) return null;

  const benevoleId = +route.params.id;
  return store.benevoles.find((b) => b.id == benevoleId);
});

const postOptions = computed(() => {
  if (store.allPostes.length === 0) return [];
  return store.allPostes.map((p) => {
    return {
      label: p!,
      value: p!,
    };
  });
});

const creneauxNodes = computed(() => {
  return store.periodes.map((p) => {
    return {
      label: p.name,
      children: p.creneaux.map((c) => {
        return { label: p.name + ' ' + c };
      }),
    };
  });
});

function addBenevole() {
  const benevoleId = store.addBenevole();

  router.replace({ path: '/benevoles/' + benevoleId });

  store.updateBenevoles();
}

function deleteBenevole() {
  if (route.params.id) {
    store.deleteBenevole(+route.params.id);
  }

  router.replace({ path: '/benevoles' });

  store.updateBenevoles();
}
</script>
