<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ periode.name }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <table class="planningPeriode">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th v-for="poste in periode.postes" :key="poste">{{ poste }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="creneau in periode.creneaux" :key="creneau">
            <th>{{ creneau }}</th>
            <td v-for="poste in periode.postes" :key="poste">
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
import PlanningCell from './PlanningCell.vue';
import { Periode } from './models';

defineOptions({
  name: 'PlanningPeriode',
});

interface Props {
  periode: Periode;
}

defineProps<Props>();
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
    }
  }
}
</style>
