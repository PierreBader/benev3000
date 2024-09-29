<template>
  <div
    class="planningCell"
    :class="{ selectableCell, selectedCell }"
    @click="cellClick"
  >
    <div
      v-for="(benevole, index) in benevoles"
      :key="benevole"
      class="benevole"
      :class="{ selected: benevole == guiStore.selectedBenevole }"
    >
      {{ benevole }}{{ index < benevoles.length - 1 ? ', ' : '' }}
    </div>
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

const selectableCell = computed(() => {
  if (!guiStore.selectedBenevole) return false;
  if (!guiStore.eventWriteAllowed) return false;

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

const selectedCell = computed(() => {
  return (
    guiStore.selectedBenevole &&
    benevoles.value.includes(guiStore.selectedBenevole)
  );
});

function cellClick() {
  if (!guiStore.selectedBenevole) return false;
  if (!guiStore.eventWriteAllowed) return false;

  const assignation: Assignation = {
    benevole: guiStore.selectedBenevole,
    periode: props.periode,
    creneau: props.creneau,
    poste: props.poste,
  };

  if (selectableCell.value) {
    planningStore.addAssignation(assignation);
    return;
  }

  if (selectedCell.value) {
    planningStore.removeAssignation(assignation);
  }
}
</script>

<style lang="scss" scoped>
.planningCell {
  min-height: 4em;
  min-width: 6em;
  max-width: 10em;
  border: 2px solid transparent;
  border-radius: 0.4em;
  padding: 0.2em;
  margin: 0.2em;

  .benevole {
    margin-right: 0.5em;
    white-space: nowrap;
  }
}

.selectableCell {
  border: 2px dotted lightgreen;
}

.selectedCell {
  border: 2px solid lightgreen;
}

.selected {
  /* background-color: green; */
}
@media print {
  .planningCell {
  }
}
</style>
