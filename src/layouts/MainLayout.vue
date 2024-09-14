<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar v-if="guiStore.eventWriteAllowed" class="bg-accent">
        <q-toolbar-title> Benev 3000 </q-toolbar-title>

        <div class="q-mr-md">Place ton bénévole</div>
        <q-chip
          removable
          @remove="guiStore.eventPass = ''"
          color="primary"
          text-color="white"
        >
          Mode écriture
        </q-chip>
      </q-toolbar>

      <q-toolbar v-else class="bg-primary">
        <q-toolbar-title> Benev 3000 </q-toolbar-title>

        <div class="q-mr-md">Place ton bénévole</div>
        <q-chip color="accent" text-color="white">
          Mode lecture
          <q-popup-edit v-model="guiStore.eventPass" auto-save v-slot="scope">
            <q-input
              v-model="scope.value"
              autofocus
              label="Clé d'accès"
              :type="isPwd ? 'password' : 'text'"
              @keyup.enter="scope.set()"
              @blur="scope.set()"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </q-popup-edit>
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useGuiStore } from 'src/stores/gui';
import { ref } from 'vue';

defineOptions({
  name: 'MainLayout',
});

const guiStore = useGuiStore();
const isPwd = ref(true);
</script>
