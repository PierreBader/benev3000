<template>
  <q-item clickable tag="a" :to="'/benevoles/' + id">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
      <q-item-label caption>{{ email }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BenevoleItem',
});

export interface BenevoleItemProps {
  id: number;
  name: string;
  icon?: string;
  email?: string;
}

withDefaults(defineProps<BenevoleItemProps>(), {
  name: '',
  icon: '',
  email: '',
});
</script>
