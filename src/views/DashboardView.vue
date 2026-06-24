<template>
  <div class="flex-1 flex flex-col h-full overflow-y-auto">
    <!-- Background glow effect similar to Gemini -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e2532] via-[#131314] to-[#131314] opacity-50 pointer-events-none"></div>
    
    <div class="flex-1 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 max-w-4xl mx-auto w-full z-10 py-12">
      
      <!-- Greeting -->
      <div class="w-full mb-8 space-y-2 text-center md:text-left">
        <h1 class="text-4xl md:text-5xl font-medium tracking-tight">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-red-400">
            Sẵn sàng học tập, Quốc Việt
          </span>
        </h1>
        <h2 class="text-3xl md:text-4xl font-medium text-[#444746]">
          Hôm nay bạn muốn chinh phục từ vựng nào?
        </h2>
      </div>

      <!-- Suggestion Cards -->
      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <button 
          v-for="(item, index) in suggestions" 
          :key="index"
          @click="$router.push('/flashcard/1')"
          class="flex flex-col items-start p-4 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-gray-800 transition-all text-left group h-28"
        >
          <div class="mb-auto p-2 bg-[#131314] rounded-full group-hover:scale-110 transition-transform">
            <component :is="item.icon" :size="18" :class="item.colorClass" />
          </div>
          <span class="text-sm text-gray-300 mt-3">{{ item.text }}</span>
        </button>
      </div>

      <!-- Input Area -->
      <div class="w-full relative mt-auto md:mt-0">
        <div class="relative bg-[#1e1f20] rounded-full border border-gray-700 hover:border-gray-500 focus-within:border-gray-400 focus-within:bg-[#282a2c] transition-colors flex items-center shadow-lg">
          
          <button class="p-3 ml-2 text-gray-400 hover:text-gray-200 transition-colors">
            <Plus :size="20" />
          </button>

          <input 
            type="text"
            v-model="inputValue"
            placeholder="Nhập chủ đề để AI tạo bộ từ vựng mới..."
            class="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 py-4 px-2 text-base"
            @keydown.enter="handleSearch"
          />

          <div class="flex items-center gap-1 mr-3">
            <button class="p-2 text-gray-400 hover:text-gray-200 hover:bg-[#333537] rounded-full transition-colors hidden sm:block">
              <ImageIcon :size="20" />
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-200 hover:bg-[#333537] rounded-full transition-colors hidden sm:block">
              <Mic :size="20" />
            </button>
            <button 
              @click="handleSearch"
              :class="['p-2 rounded-full transition-colors', inputValue ? 'text-gray-900 bg-gray-200 hover:bg-white' : 'text-gray-400 hover:bg-[#333537]']"
            >
              <Send :size="20" />
            </button>
          </div>
        </div>
        <div class="text-center text-xs text-gray-500 mt-3">
          AI có thể mắc lỗi. Hãy kiểm tra lại các từ vựng chuyên ngành.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  BookOpen, BrainCircuit, Sparkles, Plus, Image as ImageIcon, Mic, Send 
} from 'lucide-vue-next';

const router = useRouter();
const inputValue = ref('');

const suggestions = [
  { icon: BookOpen, colorClass: 'text-blue-400', text: 'Ôn tập Flashcard: TOEIC Mục tiêu 700+' },
  { icon: BrainCircuit, colorClass: 'text-purple-400', text: 'Làm bài Quiz kiểm tra trí nhớ' },
  { icon: Sparkles, colorClass: 'text-yellow-400', text: 'Tạo bộ từ vựng mới về "Du lịch"' },
];

const handleSearch = () => {
  if (inputValue.value.trim()) {
    // Navigate to a search or generate view, for now just go to flashcard as demo
    router.push('/flashcard/1');
  } else {
    router.push('/flashcard/1');
  }
};
</script>
