<template>
  <div class="planning-cell" :class="{ selectable }" @click="cellClick">
    <span
      v-for="benevole in benevoles"
      :key="benevole"
      :class="{ selected: benevole == guiStore.selectedBenevole }"
      >{{ benevole }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useGuiStore } from 'src/stores/gui';
import { usePlanningStore } from 'src/stores/planning';
import { computed } from 'vue';
import { Assignation } from './models';

defineOptions({
  name: 'PlanningCell',
});
interface Props {
  periode: string;
  creneau: string;
  poste: string;
}

const props = defineProps<Props>();

const planningStore = usePlanningStore();
const guiStore = useGuiStore();

const benevoles = computed(() => {
  return planningStore.assignations
    .filter(
      (a) =>
        a.periode == props.periode &&
        a.creneau == props.creneau &&
        a.poste == props.poste
    )
    .map((a) => a.benevole);
});

const selectable = computed(() => {
  if (!guiStore.selectedBenevole) return false;
  if (benevoles.value.includes(guiStore.selectedBenevole)) return false;

  const benevole = planningStore.benevoles.find(
    (b) => b.name == guiStore.selectedBenevole
  );
  if (!benevole) return false;
  if (!benevole.postes.includes(props.poste)) return false;

  if (
    planningStore.assignations.some(
      (a) =>
        a.benevole == guiStore.selectedBenevole &&
        a.periode == props.periode &&
        a.creneau == props.creneau
    )
  ) {
    return false;
  }

  const creneauName = props.periode + ' ' + props.creneau;
  return benevole.availability.includes(creneauName);
});

function cellClick() {
  if (!guiStore.selectedBenevole) return false;

  const assignation: Assignation = {
    benevole: guiStore.selectedBenevole,
    periode: props.periode,
    creneau: props.creneau,
    poste: props.poste,
  };

  if (selectable.value) {
    planningStore.addAssignation(assignation);
    return;
  }

  if (benevoles.value.includes(guiStore.selectedBenevole)) {
    planningStore.removeAssignation(assignation);
  }
}
</script>

<style lang="css" scoped>
.planning-cell {
  min-height: 4em;
  min-width: 6em;
}
.selectable {
  border: 1px solid green;
}

.selected {
  background-color: green;
}
</style>
