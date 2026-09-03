<template>
  <div class="typing-wrapper flex flex-col items-center p-4 md:p-8 w-full max-w-4xl mx-auto h-full overflow-y-auto">
    <!-- Header -->
    <div class="w-full flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Luyện Gõ Từ Vựng</h1>
        <button @click="showTutorial = true" class="p-2 bg-blue-900/40 text-blue-400 hover:bg-blue-800/60 rounded-full transition-colors" title="Hướng dẫn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
        </button>
      </div>
      <button @click="goToFlashcard" class="px-4 py-2 bg-[#1e1f20] hover:bg-[#282a2c] border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
        Chuyển sang Flashcard
      </button>
    </div>

    <!-- Mode Selector -->
    <div class="mb-6 flex p-1 bg-[#1e1f20] rounded-xl border border-gray-800 self-center">
      <button 
        @click="changeMode('en-vi')" 
        :class="['px-6 py-2.5 rounded-lg font-medium transition-all duration-200', mode === 'en-vi' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200']"
      >
        Gõ Tiếng Việt
      </button>
      <button 
        @click="changeMode('vi-en')" 
        :class="['px-6 py-2.5 rounded-lg font-medium transition-all duration-200', mode === 'vi-en' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200']"
      >
        Gõ Tiếng Anh
      </button>
    </div>

    <div v-if="loading" class="text-gray-400 mt-10 text-lg flex items-center gap-3">
      <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      Đang tải dữ liệu...
    </div>
    
    <div v-else-if="vocabList.length === 0" class="text-gray-400 mt-10 text-lg">Không có từ vựng nào trong bộ thẻ này!</div>

    <!-- Completion Screen (Detailed Table) -->
    <div v-else-if="currentIndex >= vocabList.length" class="mt-4 bg-[#1e1f20] border border-gray-800 p-6 sm:p-10 rounded-2xl w-full shadow-xl">
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
        </div>
        <h2 class="text-3xl text-white font-bold mb-2">Hoàn thành!</h2>
        <p class="text-gray-300 text-lg">Bạn đã gõ đúng <span class="text-green-400 font-bold text-2xl mx-1">{{ correctCount }}</span> / {{ vocabList.length }} từ.</p>
      </div>

      <!-- Detail Table -->
      <div class="overflow-x-auto w-full mb-8 rounded-xl border border-gray-700">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-800 text-gray-300">
              <th class="p-4 font-semibold w-12 text-center">#</th>
              <th class="p-4 font-semibold">Từ vựng (EN)</th>
              <th class="p-4 font-semibold">Nghĩa (VI)</th>
              <th class="p-4 font-semibold">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, idx) in vocabList" 
              :key="idx" 
              :class="['border-t border-gray-700/50', item._status === 'correct' ? 'bg-green-900/10 hover:bg-green-900/20' : 'bg-red-900/10 hover:bg-red-900/20']"
            >
              <td class="p-4 text-gray-400 text-center">{{ idx + 1 }}</td>
              <td class="p-4 text-white font-medium">{{ item.word }}</td>
              <td class="p-4 text-gray-300">{{ item.meaning }}</td>
              <td class="p-4">
                <span v-if="item._status === 'correct'" class="inline-flex items-center gap-1 text-green-400 font-medium px-2.5 py-1 bg-green-900/30 rounded-md text-sm border border-green-800/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Đúng
                </span>
                <span v-else class="inline-flex items-center gap-1 text-red-400 font-medium px-2.5 py-1 bg-red-900/30 rounded-md text-sm border border-red-800/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Sai {{ item._hintUsed ? '(Dùng gợi ý)' : '' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex gap-4 justify-center">
        <button @click="reset" class="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors">Học lại</button>
        <button @click="$router.push('/')" class="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors">Về trang chủ</button>
      </div>
    </div>

    <!-- Typing Area -->
    <div v-else class="w-full bg-[#1e1f20] border border-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col items-center">
      <!-- Progress -->
      <div class="w-full flex items-center justify-between mb-2">
        <span class="text-gray-400 text-sm font-medium">Tiến độ</span>
        <span class="text-gray-400 text-sm font-medium">{{ currentIndex + 1 }} / {{ vocabList.length }}</span>
      </div>
      <div class="w-full bg-gray-800 h-2.5 rounded-full mb-10 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out" :style="{ width: `${((currentIndex) / vocabList.length) * 100}%` }"></div>
      </div>
      
      <!-- Question -->
      <div class="text-center mb-8 min-h-[100px] flex flex-col items-center justify-center relative w-full">
        <h2 class="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-wide">{{ currentQuestion }}</h2>
        <div v-if="mode === 'en-vi' && currentVocab.type" class="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm font-medium border border-blue-800/50 mb-2">
          {{ currentVocab.type }}
        </div>
        
        <!-- Hint Display -->
        <div v-if="currentHint" class="mt-4 text-2xl font-mono tracking-[0.5em] text-yellow-400 bg-yellow-900/20 px-4 py-2 rounded-lg border border-yellow-700/50">
          {{ currentHint }}
        </div>
      </div>

      <!-- Input Area -->
      <div class="w-full relative max-w-lg mx-auto">
        <input 
          ref="inputRef"
          v-model="userInput" 
          @keydown.enter="handleEnter"
          :class="['w-full bg-[#131314] border-2 rounded-xl px-6 py-4 text-xl sm:text-2xl text-center text-white outline-none transition-all duration-200 placeholder-gray-600 shadow-inner', inputStatusClass]"
          :placeholder="mode === 'en-vi' ? 'Nhập nghĩa tiếng Việt...' : 'Nhập từ tiếng Anh...'"
          :disabled="showResult"
          autofocus
        />
        
        <!-- Hint Button -->
        <button 
          v-if="!showResult"
          @click="useHint" 
          class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-900/30 rounded-lg transition-colors flex items-center gap-1"
          title="Gợi ý (Sẽ tính là sai)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
        </button>
        
        <!-- Result Message -->
        <div v-if="showResult" class="mt-6 p-5 rounded-xl w-full text-center transition-all animate-in fade-in slide-in-from-top-4" :class="isCorrect ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'">
          <h3 :class="['text-2xl font-bold mb-2 flex items-center justify-center gap-2', isCorrect ? 'text-green-400' : 'text-red-400']">
            <svg v-if="isCorrect" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            {{ isCorrect ? 'Chính xác!' : 'Chưa chính xác!' }}
          </h3>
          <div v-if="!isCorrect" class="text-gray-300 text-lg mb-5 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Đáp án đúng:</span>
            <span class="font-bold text-green-400 text-xl bg-green-900/30 px-3 py-1 rounded border border-green-800/50">{{ currentAnswer }}</span>
          </div>
          <button @click="nextWord" class="px-8 py-3 bg-[#282a2c] hover:bg-[#333537] border border-gray-700 rounded-xl text-white font-medium transition-colors w-full sm:w-auto shadow-sm" ref="nextBtnRef">Tiếp tục (Nhấn Enter)</button>
        </div>
      </div>
    </div>

    <!-- Tutorial Modal -->
    <div v-if="showTutorial" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-[#1e1f20] border border-gray-700 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button @click="showTutorial = false" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <h3 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <svg class="text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          Hướng dẫn luyện gõ
        </h3>
        <ul class="space-y-4 text-gray-300">
          <li class="flex gap-3">
            <span class="mt-1 w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center shrink-0">1</span>
            <span>Đọc từ hoặc nghĩa trên màn hình và gõ đáp án tương ứng vào ô trống.</span>
          </li>
          <li class="flex gap-3">
            <span class="mt-1 w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center shrink-0">2</span>
            <span>Nhấn <strong>Enter</strong> để kiểm tra đáp án của bạn.</span>
          </li>
          <li class="flex gap-3">
            <span class="mt-1 w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center shrink-0">3</span>
            <span>Nhấn vào biểu tượng <strong class="text-yellow-500">Bóng đèn</strong> nếu bạn cần gợi ý (lưu ý: dùng gợi ý sẽ bị tính là sai).</span>
          </li>
          <li class="flex gap-3">
            <span class="mt-1 w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center shrink-0">4</span>
            <span>Sau khi hoàn thành, bạn sẽ xem được bảng thống kê chi tiết các từ đã nhập đúng và sai.</span>
          </li>
        </ul>
        <button @click="showTutorial = false" class="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-colors">
          Đã hiểu
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import deckService from '@/services/deck.service'

const route = useRoute()
const router = useRouter()

// State
const vocabList = ref([])
const loading = ref(true)
const currentIndex = ref(0)
const userInput = ref('')
const showResult = ref(false)
const isCorrect = ref(false)
const correctCount = ref(0)
const mode = ref('en-vi') // 'en-vi' (Type Vietnamese) or 'vi-en' (Type English)
const showTutorial = ref(false)

// Hint state
const hintLevel = ref(0) // How many characters are revealed

// Refs for DOM elements
const inputRef = ref(null)
const nextBtnRef = ref(null)

// Computed
const currentVocab = computed(() => vocabList.value[currentIndex.value] || {})

const currentQuestion = computed(() => {
  if (!currentVocab.value) return ''
  return mode.value === 'en-vi' ? currentVocab.value.word : currentVocab.value.meaning
})

const currentAnswer = computed(() => {
  if (!currentVocab.value) return ''
  return mode.value === 'en-vi' ? currentVocab.value.meaning : currentVocab.value.word
})

const currentHint = computed(() => {
  if (hintLevel.value === 0 || !currentAnswer.value) return ''
  
  // Format hint: show first N letters, rest are underscores
  const answer = currentAnswer.value.trim()
  let hintStr = ''
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === ' ') {
      hintStr += '  '
    } else if (i < hintLevel.value) {
      hintStr += answer[i]
    } else {
      hintStr += '_'
    }
  }
  return hintStr
})

const inputStatusClass = computed(() => {
  if (!showResult.value) return 'border-gray-700 focus:border-blue-500'
  return isCorrect.value ? 'border-green-500 text-green-400 bg-green-900/10' : 'border-red-500 text-red-400 bg-red-900/10'
})

// Methods
const fetchVocabFromBackend = async () => {
  loading.value = true
  try {
    const deckId = route.params.id;
    if (deckId) {
      const deckData = await deckService.get(deckId);
      // Giả định backend populate vocab_list
      vocabList.value = (deckData.vocab_list || []).map(item => ({
        ...item,
        _status: null, // 'correct' or 'incorrect'
        _hintUsed: false
      }));
      shuffleVocab()
    } else {
      vocabList.value = [];
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu bộ thẻ:", error)
    vocabList.value = [];
  } finally {
    loading.value = false
    // Show tutorial on first load if they haven't seen it (simple demo logic)
    if (vocabList.value.length > 0 && currentIndex.value === 0) {
       // Optional: showTutorial.value = true
    }
    focusInput()
  }
}

// Xáo trộn danh sách từ vựng để học không bị nhàm chán
const shuffleVocab = () => {
  const shuffled = [...vocabList.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  vocabList.value = shuffled.map(item => ({...item, _status: null, _hintUsed: false}))
}

const useHint = () => {
  if (currentVocab.value) {
    currentVocab.value._hintUsed = true
    hintLevel.value++
    // focus back to input
    focusInput()
  }
}

const checkAnswer = () => {
  if (!userInput.value.trim() || showResult.value) return

  const inputCleaned = userInput.value.trim().toLowerCase()
  let answerCleaned = currentAnswer.value.toLowerCase().trim()
  
  if (mode.value === 'en-vi') {
      const possibleAnswers = answerCleaned.split(/[,;]/).map(s => s.trim())
      isCorrect.value = possibleAnswers.some(ans => inputCleaned === ans || inputCleaned.includes(ans) || ans.includes(inputCleaned))
  } else {
      isCorrect.value = inputCleaned === answerCleaned
  }

  // Nếu dùng hint thì luôn bị tính là sai cho dù nhập đúng
  if (currentVocab.value._hintUsed) {
    isCorrect.value = false
  }

  if (isCorrect.value) {
    correctCount.value++
    currentVocab.value._status = 'correct'
  } else {
    currentVocab.value._status = 'incorrect'
  }

  showResult.value = true
  
  // Tự động phát âm khi gõ xong (nếu là chế độ gõ tiếng Anh hoặc học tiếng Anh)
  if ('speechSynthesis' in window && (mode.value === 'vi-en' || isCorrect.value)) {
    const textToSpeak = mode.value === 'vi-en' ? currentAnswer.value : currentQuestion.value;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  nextTick(() => {
    if (nextBtnRef.value) {
      nextBtnRef.value.focus()
    }
  })
}

const handleEnter = () => {
  if (showResult.value) {
    nextWord()
  } else {
    checkAnswer()
  }
}

const nextWord = () => {
  currentIndex.value++
  userInput.value = ''
  showResult.value = false
  hintLevel.value = 0
  focusInput()
}

const reset = () => {
  currentIndex.value = 0
  correctCount.value = 0
  userInput.value = ''
  showResult.value = false
  hintLevel.value = 0
  shuffleVocab()
  focusInput()
}

const focusInput = () => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

const changeMode = (newMode) => {
  mode.value = newMode
  reset()
}

const goToFlashcard = () => {
  const id = route.params.id || 1
  router.push(`/flashcard/${id}`)
}

onMounted(() => {
  fetchVocabFromBackend()
})

watch(() => route.params.id, () => {
  fetchVocabFromBackend()
})
</script>

<style scoped>
/* Scoped styles can go here */
</style>
