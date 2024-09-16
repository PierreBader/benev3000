<template>
  <div class="q-pa-md" v-if="guiStore.eventLoaded">
    <div class="q-gutter-sm">
      <div class="text-h4">
        Planning de
        <span class="cursor-pointer">
          {{ planningStore.eventName || "l'évenement" }}
          <q-icon
            name="edit"
            class="print-hide"
            size="sm"
            v-if="guiStore.eventWriteAllowed"
          />
          <q-popup-edit
            v-model="planningStore.eventName"
            auto-save
            v-slot="scope"
            v-if="guiStore.eventWriteAllowed"
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
      <div class="print-hide" v-if="guiStore.eventWriteAllowed">
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
        <q-btn-group push class="q-mr-md">
          <q-btn
            label="Clé d'accès"
            color="primary"
            outline
            @click="openEventPassPrompt"
            icon="key"
          />

          <q-dialog v-model="eventPassPrompt">
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Modifier la clé d'accès</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  v-model="currentEventPass"
                  :type="isPwd ? 'password' : 'text'"
                  label="Clé actuelle"
                  autofocus
                  :rules="[
                    (val) =>
                      val == guiStore.eventPass ||
                      'Mot de passe actuel invalide',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>

                <q-input
                  dense
                  v-model="newEventPass"
                  :type="isPwd ? 'password' : 'text'"
                  label="Nouvelle clé"
                  @keyup.enter="setEventPass"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Annuler" color="negative" v-close-popup />
                <q-btn
                  flat
                  label="Confirmer"
                  color="positive"
                  v-close-popup
                  @click="setEventPass"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-btn-group>
      </div>

      <div
        class="q-ma-md print-hide text-italic text-subtitle1"
        v-if="!planningStore.hasBenevoles && !planningStore.hasPeriodes"
      >
        C'est vide ici ! Ajoute des périodes et des bénévoles pour construire le
        planning
      </div>

      <div class="q-pb-md print-hide" v-if="planningStore.hasBenevoles">
        <div v-if="$q.screen.lt.sm">
          <q-select
            v-model="guiStore.selectedBenevole"
            :options="benevoleOptions"
            clearable
            label="Bénévole"
          />
        </div>

        <div v-else>
          <div class="text-subtitle1">Bénévole</div>
          <q-radio
            v-model="guiStore.selectedBenevole"
            :val="null"
            label="Tous"
          />
          <q-radio
            v-for="benevole in planningStore.benevoles"
            v-model="guiStore.selectedBenevole"
            v-bind:key="benevole.id"
            :val="benevole.name"
            :label="benevole.name"
          />
        </div>
      </div>
      <div
        class="q-pb-md print-hide text-italic text-subtitle1"
        v-else-if="planningStore.hasPeriodes"
      >
        Aucun bénévole
      </div>

      <div class="q-pb-md print-hide" v-if="planningStore.hasPeriodes">
        <div v-if="$q.screen.lt.sm">
          <q-select
            v-model="guiStore.selectedPeriode"
            :options="periodeOptions"
            clearable
            label="Période"
          />
        </div>

        <div v-else>
          <div class="text-subtitle1">Période</div>
          <q-radio
            v-model="guiStore.selectedPeriode"
            :val="null"
            label="Toutes"
          />
          <q-radio
            v-for="periode in planningStore.periodes"
            v-model="guiStore.selectedPeriode"
            v-bind:key="periode.id"
            :val="periode.name"
            :label="periode.name"
          />
        </div>
      </div>

      <div class="q-pb-md print-hide" v-if="planningStore.hasPeriodes">
        <div v-if="$q.screen.lt.sm">
          <q-select
            v-model="guiStore.selectedPoste"
            :options="planningStore.allPostes"
            clearable
            label="Poste"
          />
        </div>

        <div v-else>
          <div class="text-subtitle1">Poste</div>
          <q-radio v-model="guiStore.selectedPoste" :val="null" label="Tous" />
          <q-radio
            v-for="poste in planningStore.allPostes"
            v-model="guiStore.selectedPoste"
            v-bind:key="poste"
            :val="poste"
            :label="poste"
          />
        </div>
      </div>

      <div v-if="planningStore.hasPeriodes" class="row">
        <PlanningPeriode
          v-for="periode in periodes"
          :key="periode.id"
          :periode="periode"
        />
      </div>

      <div
        class="q-pb-md print-hide text-italic text-subtitle1"
        v-else-if="planningStore.hasBenevoles"
      >
        Aucune période
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import PlanningPeriode from 'src/components/PlanningPeriode.vue';
import { useGuiStore } from 'src/stores/gui';
import { usePlanningStore } from 'src/stores/planning';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const planningStore = usePlanningStore();
const guiStore = useGuiStore();
const route = useRoute();
const router = useRouter();

const eventPassPrompt = ref(false);
const currentEventPass = ref('');
const newEventPass = ref('');
const isPwd = ref(true);
const $q = useQuasar();

defineOptions({
  name: 'PlanningPage',
});

onMounted(() => {
  syncEvent();
});

watch(
  () => route.params.eventId,
  () => {
    syncEvent();
  }
);

async function syncEvent() {
  if (!route.params.eventId) return;

  let eventId =
    typeof route.params.eventId == 'string'
      ? route.params.eventId
      : route.params.eventId[0];

  await planningStore.initEventSync(eventId);

  if (!guiStore.eventLoaded) {
    router.replace('/');
  }
}

function openEventPassPrompt() {
  currentEventPass.value = '';
  newEventPass.value = '';
  eventPassPrompt.value = true;
}

async function setEventPass() {
  if (currentEventPass.value != guiStore.eventPass) {
  }

  await planningStore.setEventHash(newEventPass.value);
  guiStore.eventPass = newEventPass.value;

  $q.notify({
    position: 'top',
    message: "Clé d'accès modifiée",
  });

  eventPassPrompt.value = false;
}

const benevoleOptions = computed(() => {
  if (planningStore.benevoles.length === 0) return [];
  return planningStore.benevoles.map((b) => b!.name);
});

const periodeOptions = computed(() => {
  if (planningStore.periodes.length === 0) return [];
  return planningStore.periodes.map((p) => p!.name);
});

const periodes = computed(() => {
  return planningStore.periodes.filter((p) => {
    if (guiStore.selectedPeriode && p.name != guiStore.selectedPeriode)
      return false;
    if (
      guiStore.selectedPoste &&
      (!p.postes || !p.postes.includes(guiStore.selectedPoste))
    )
      return false;
    return true;
  });
});
</script>

<style lang="scss" scoped>
@media print {
  .text-h4 {
    font-size: 16px;
    line-height: 1.5;
  }

  .q-ma-sm {
    margin: 4px 4px;
  }
}
</style>
