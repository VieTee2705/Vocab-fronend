<template>
  <div class="flex h-screen bg-[#131314] text-[#e3e3e3] font-sans overflow-hidden">
    <!-- SIDEBAR -->
    <Sidebar :isSidebarOpen="isSidebarOpen" @toggle="isSidebarOpen = !isSidebarOpen" />

    <!-- MAIN CONTENT AREA -->
    <div class="flex-1 flex flex-col relative h-full w-full">
      
      <!-- Toggle Sidebar Button (Mobile) or when collapsed -->
      <div v-if="!isSidebarOpen" class="absolute top-4 left-4 z-10">
        <button 
          @click="isSidebarOpen = true"
          class="p-2 hover:bg-[#282a2c] rounded-full transition-colors bg-[#131314]/80 backdrop-blur flex items-center justify-center"
        >
          <MenuIcon class="text-gray-400 w-5 h-5" />
        </button>
      </div>

      <router-view />

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Menu as MenuIcon } from 'lucide-vue-next';
import Sidebar from '@/components/Sidebar.vue';

const isSidebarOpen = ref(true);
</script>

<style>
/* Reset some default margins and set font if needed */
body {
  margin: 0;
  padding: 0;
}
</style>