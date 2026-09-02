<template>
  <div class="deck-wrapper">
    <div class="w-full flex justify-between items-center mb-4 max-w-lg">
      <h1>Học Từ Vựng</h1>
      <button @click="$router.push('/typing/' + route.params.id)" class="px-4 py-2 bg-[#1e1f20] hover:bg-[#282a2c] border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Luyện Gõ
      </button>
    </div>
    
    <div v-if="loading" class="loading">Đang tải dữ liệu từ backend...</div>
    
    <div v-else-if="vocabList.length > 0" class="flashcard-section">
      <FlashCards
        :items="vocabList"
        itemKey="id"
        @swipe-left="onSwipeLeft"
        @swipe-right="onSwipeRight"
      >
        <template #default="{ item }">
          <FlashcardItem :vocab="item" />
        </template>

        <template #actions="{ swipeLeft, swipeRight, restore, canRestore }">
          <div class="controls">
            <button @click="restore" :disabled="!canRestore" class="btn-restore">Quay lại</button>
            <button @click="swipeLeft" class="btn-skip">Chưa thuộc</button>
            <button @click="swipeRight" class="btn-known">Đã thuộc</button>
          </div>
        </template>
      </FlashCards>
    </div>
    
    <div v-else class="empty">Không có từ vựng nào!</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import FlashcardItem from '../components/FlashcardItem.vue'
import { FlashCards } from 'vue3-flashcards'
import deckService from '@/services/deck.service'

// Khai báo state
const vocabList = ref([])
const loading = ref(true)
const route = useRoute()

// Hàm gọi API thực tế
const fetchVocabFromBackend = async () => {
  loading.value = true
  try {
    const deckId = route.params.id;
    if (deckId) {
      const deckData = await deckService.get(deckId);
      // Giả định backend populate vocab_list, nếu không thì cần gọi API từ vựng tương ứng
      vocabList.value = deckData.vocab_list || [];
    } else {
      console.warn("Chưa có ID bộ thẻ trong URL");
      vocabList.value = [];
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu bộ thẻ:", error)
    vocabList.value = [];
  } finally {
    loading.value = false
  }
}

// Chạy hàm fetch khi component được mount
onMounted(() => {
  fetchVocabFromBackend()
})

// Lắng nghe sự thay đổi của route để fetch lại dữ liệu nếu ID thay đổi
watch(() => route.params.id, () => {
  fetchVocabFromBackend()
})

const onSwipeLeft = (item) => {
  console.log('Chưa thuộc:', item.word)
}

const onSwipeRight = (item) => {
  console.log('Đã thuộc:', item.word)
}
</script>

<style scoped>
.deck-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  padding: 2rem;
}

.flashcard-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  width: 100%;
  max-width: 400px;
}

.controls {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

button {
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

button:disabled {
  background-color: #ccc !important;
  cursor: not-allowed;
  opacity: 0.7;
}

button:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-restore {
  background-color: #607d8b;
}

.btn-skip {
  background-color: #f44336;
}

.btn-known {
  background-color: #4CAF50;
}

.loading, .empty {
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #666;
}
</style>