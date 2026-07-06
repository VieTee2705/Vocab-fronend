<template>
  <div class="flex-1 flex flex-col h-full overflow-y-auto w-full p-4 md:p-8 relative">
    <!-- Background glow effect similar to Gemini -->
    <div class="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e2532] via-[#131314] to-[#131314] opacity-50 pointer-events-none z-0"></div>
    <div class="w-full flex-1 flex flex-col items-center z-10 relative">
      <!-- Search Header & Input -->
      <div class="w-full mb-8 text-center max-w-4xl mx-auto">
        <h1 class="text-3xl font-medium text-white mb-6">Tra cứu từ vựng</h1>
        <div class="relative w-full max-w-2xl mx-auto">
          <div class="relative bg-[#1e1f20] rounded-full border border-gray-700 hover:border-gray-500 focus-within:border-gray-400 focus-within:bg-[#282a2c] transition-colors flex items-center shadow-lg px-4 py-2">
            <!-- Select Deck / Lesson Filter -->
            <select 
              v-model="selectedLessonTitle" 
              class="bg-transparent text-white font-medium border-none outline-none mr-3 border-r border-gray-500 pr-3 cursor-pointer appearance-none text-sm focus:ring-0"
              style="min-width: 120px;"
            >
              <option value="" class="bg-[#1e1f20] text-white">Tất cả bài học</option>
              <option v-for="deck in decks" :key="deck._id || deck.id" :value="deck.title" class="bg-[#1e1f20] text-white">
                {{ deck.title }}
              </option>
            </select>
            
            <Search class="text-gray-300 w-5 h-5 mr-3" />
            <input 
              type="text"
              v-model="searchQuery"
              placeholder="Nhập từ vựng tiếng Anh cần tìm kiếm..."
              class="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 py-2 text-base min-w-0"
            />
            <button 
              @click="performSearch"
              class="p-2 ml-2 rounded-full transition-colors text-gray-900 bg-gray-200 hover:bg-white flex-shrink-0 flex items-center justify-center disabled:opacity-50"
              :disabled="loading"
            >
              <Search class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div class="w-full flex-1 relative">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else-if="hasSearched && results.length === 0" class="text-center py-12 text-gray-400">
          Không tìm thấy từ vựng nào khớp với "{{ searchQuery }}".
        </div>

        <div v-else-if="results.length > 0" class="w-full max-w-6xl mx-auto flex flex-wrap gap-6 justify-center pb-12">
          <FlashcardItem 
            v-for="vocab in results" 
            :key="vocab._id || vocab.custom_id" 
            :vocab="vocab" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Search } from 'lucide-vue-next';
import FlashcardItem from '@/components/FlashcardItem.vue';
import vocabularyService from '@/services/vocabulary.service';
import deckService from '@/services/deck.service';

const searchQuery = ref('');
const selectedLessonTitle = ref('');
const decks = ref([]);
const results = ref([]);
const loading = ref(false);
const hasSearched = ref(false);
let searchTimeout = null;

const fetchDecks = async () => {
  try {
    const data = await deckService.getAll();
    decks.value = data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách bài học:", error);
  }
};

onMounted(() => {
  fetchDecks();
  // Call search initially to show all if wanted, but user asked for "when selecting lesson..." 
  // we can just leave it empty initially or trigger performSearch.
});

watch([searchQuery, selectedLessonTitle], ([newQuery, newLesson]) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  if (!newQuery.trim() && !newLesson) {
    results.value = [];
    hasSearched.value = false;
    return;
  }

  searchTimeout = setTimeout(() => {
    performSearch();
  }, 500); // Wait for 500ms pause before searching
});

const performSearch = async () => {
  const query = searchQuery.value.trim();
  const lessonTitle = selectedLessonTitle.value;
  
  if (!query && !lessonTitle) return;

  loading.value = true;
  hasSearched.value = true;
  
  try {
    const params = {};
    if (query) params.word = query;
    if (lessonTitle) {
      // Extract "Lesson 1" from "Lesson 1: Title name" and map to "lesson_1"
      const prefix = lessonTitle.split(':')[0].trim();
      params.tags = prefix.toLowerCase().replace(/\s+/g, '_');
    }

    const data = await vocabularyService.getAll(params);
    results.value = data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm từ vựng:", error);
    results.value = [];
  } finally {
    loading.value = false;
  }
};
</script>
