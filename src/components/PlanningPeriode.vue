<template>
  <q-card class="q-ma-sm periodeCard">
    <q-card-section>
      <div class="text-h6">{{ periode.name }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <table class="planningPeriode">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th v-for="poste in postes" :key="poste">{{ poste }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="creneau in props.periode.creneaux" :key="creneau">
            <th>{{ creneau }}</th>
            <td v-for="poste in postes" :key="poste">
              <PlanningCell
                :periode="periode.name"
                :poste="poste"
                :creneau="creneau"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PlanningCell from './PlanningCell.vue';
import { Periode } from './models';
import { useGuiStore } from 'src/stores/gui';

const guiStore = useGuiStore();

defineOptions({
  name: 'PlanningPeriode',
});

interface Props {
  periode: Periode;
}

const postes = computed(() => {
  if (!guiStore.selectedPoste) return props.periode.postes;
  if (props.periode.postes.includes(guiStore.selectedPoste))
    return [guiStore.selectedPoste];
  else return [];
});

const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.planningPeriode {
  border-collapse: collapse;

  th {
    font-weight: 500;
  }

  thead th {
    text-align: center;
  }

  tbody {
    th {
      text-align: right;
      padding-right: 0.4em;
    }
    tr:nth-child(even) {
      background-color: #eef;
    }

    td,
    th {
      border-right: 1px solid gray;
      border-bottom: 1px solid gray;
    }
  }
}
@media print {
  .periodeCard {
    page-break-inside: avoid;
  }
  .planningPeriode {
    font-size: 8px;
  }
  .q-card__section--vert {
    padding: 8px;
  }
  .text-h6 {
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>
