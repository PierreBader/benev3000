<template>
  <div class="q-pa-md">
    <h3>Evenements à venir</h3>
    <q-btn
      v-for="e in events"
      :key="e.id"
      size="35px"
      color="teal"
      class="q-ma-xl"
      :to="'/' + e.id"
    >
      {{ e.name }}
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import { onMounted, reactive } from 'vue';

defineOptions({
  name: 'EventsPage',
});

let events: Event[] = reactive([]);

onMounted(async () => {
  const eventsQuery = query(
    collection(db, 'events'),
    where('display', '==', true)
  );

  const querySnapshot = await getDocs(eventsQuery);
  querySnapshot.forEach((doc) => {
    events.push({
      id: doc.id,
      name: doc.data().eventName,
    });
  });
});

interface Event {
  id: string;
  name: string;
}
</script>

<style lang="scss" scoped></style>
