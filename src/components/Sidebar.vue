<template>
  <div :class="[
    isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full',
    'transition-all duration-300 ease-in-out flex flex-col bg-[#1e1f20] sm:bg-transparent fixed sm:relative z-20 h-full border-r border-gray-800 sm:border-none'
  ]">
    <div class="p-4 flex items-center justify-between">
      <button 
        @click="$emit('toggle')"
        class="p-2 hover:bg-[#282a2c] rounded-full transition-colors flex items-center gap-2"
      >
        <MenuIcon class="text-gray-400 w-5 h-5" />
      </button>
      <!-- Logo -->
      <div class="flex items-center gap-2 text-xl font-medium cursor-pointer" @click="$router.push('/')">
         <Sparkles class="text-blue-400 w-5 h-5" />
         <span :class="[!isSidebarOpen && 'hidden', 'sm:block']">Vocab AI</span>
      </div>
    </div>

    <!-- New Set Button -->
    <div class="px-4 mt-2">
      <button 
        @click="$router.push('/')"
        class="flex items-center gap-2 bg-[#1a1a1c] hover:bg-[#282a2c] text-sm font-medium py-2.5 px-4 rounded-full border border-gray-700 transition-colors w-max"
      >
        <Plus class="w-[18px] h-[18px]" />
        <span :class="[!isSidebarOpen && 'hidden', 'sm:block']">Tạo bài học mới</span>
      </button>

      <button 
        @click="$router.push('/search')"
        class="flex items-center gap-2 bg-[#1a1a1c] hover:bg-[#282a2c] text-sm font-medium py-2.5 px-4 rounded-full border border-gray-700 transition-colors w-max mt-3"
      >
        <Search class="w-[18px] h-[18px]" />
        <span :class="[!isSidebarOpen && 'hidden', 'sm:block']">Tra từ</span>
      </button>
    </div>

    <!-- Recent History -->
    <div :class="['flex-1 overflow-y-auto mt-6 px-3', !isSidebarOpen && 'hidden', 'sm:block']">
      <div class="text-xs font-semibold text-gray-500 mb-3 px-2">Gần đây</div>
      <div class="space-y-1">
        <button
          v-for="set in recentSets"
          :key="set.id"
          @click="goToDeck(set.id)"
          :class="[
            'w-full flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors group text-left text-sm',
            isActive(set.id) ? 'bg-[#282a2c] text-white' : 'hover:bg-[#282a2c] text-gray-300'
          ]"
        >
          <MessageSquare :class="[isActive(set.id) ? 'text-white' : 'text-gray-400', 'shrink-0 w-4 h-4']" />
          <span :class="['truncate flex-1', isActive(set.id) ? 'text-white' : 'text-gray-300']">{{ set.title }}</span>
          <History
            v-if="set.pinned || isActive(set.id)"
            :class="[(isActive(set.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'), 'text-gray-500 w-3.5 h-3.5']"
          />
        </button>
      </div>
      <button class="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-[#282a2c] rounded-lg transition-colors text-left text-sm text-gray-500 mt-2">
         <ChevronRight class="w-4 h-4" />
         <span>Xem thêm</span>
      </button>
    </div>

    <!-- Bottom Actions -->
    <div :class="['p-4 mt-auto border-t border-gray-800 sm:border-none', !isSidebarOpen && 'hidden', 'sm:block']">
      <button class="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-[#282a2c] rounded-lg transition-colors text-left text-sm mb-1">
         <Settings class="text-gray-400 w-[18px] h-[18px]" />
         <span>Cài đặt</span>
      </button>
      <div class="flex items-center gap-3 px-2 py-2.5 hover:bg-[#282a2c] rounded-lg transition-colors cursor-pointer mt-2">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          QV
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium truncate">Quốc Việt</div>
          <div class="text-xs text-gray-500">Pro Plan</div>
        </div>
        <Settings class="text-gray-400 w-4 h-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  Menu as MenuIcon, Sparkles, Plus, MessageSquare, History, ChevronRight, Settings, Search 
} from 'lucide-vue-next';
import deckService from '@/services/deck.service';

defineProps({
  isSidebarOpen: {
    type: Boolean,
    default: true
  }
});

defineEmits(['toggle']);

const router = useRouter();
const route = useRoute();
const recentSets = ref([]);

const isActive = (id) => {
  const paramId = route.params && route.params.id ? String(route.params.id) : null;
  return paramId === String(id) || route.path === `/flashcard/${id}`;
};

const fetchDecks = async () => {
  try {
    const data = await deckService.getAll();
    recentSets.value = data.map(deck => ({
      id: deck._id,
      title: deck.title,
      pinned: false // You can add pinned logic later
    }));
  } catch (error) {
    console.error("Lỗi lấy danh sách bộ thẻ:", error);
  }
};

const goToDeck = (id) => {
  router.push(`/flashcard/${id}`);
};

onMounted(() => {
  fetchDecks();
});
</script>
