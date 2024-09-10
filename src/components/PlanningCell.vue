<template>
  <div>
    <span v-for="benevole in benevoles" :key="benevole">{{ benevole }}</span>
  </div>
</template>

<script setup lang="ts">
import { usePlanningStore } from 'src/stores/planning';
import { computed } from 'vue';

defineOptions({
  name: 'PlanningCell',
});
interface Props {
  periode: string;
  creneau: string;
  poste: string;
}

const props = defineProps<Props>();

const store = usePlanningStore();

const benevoles = computed(() => {
  return store.assignations
    .filter(
      (a) =>
        a.periode == props.periode &&
        a.creneau == props.creneau &&
        a.poste == props.poste
    )
    .map((a) => a.benevole);
});
</script>
