<template>
  <q-item clickable tag="a" :to="'/periodes/' + id">
    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PeriodeItem',
});

export interface PeriodeItemProps {
  id: number;
  name: string;
}

withDefaults(defineProps<PeriodeItemProps>(), {});
</script>
