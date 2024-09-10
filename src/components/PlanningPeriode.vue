<template>
  <div>
    <h6>{{ periode.name }}</h6>
    <table>
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
  </div>
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
