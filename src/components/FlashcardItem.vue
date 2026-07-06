<!-- Frontend/src/components/FlashcardItem.vue -->
<template>
  <div class="flashcard-container" @click="handleFlip">
    <FlipCard flipAxis="y">
      <template #front>
        <div class="flashcard-front">
          <h2 class="word">{{ vocab.word }}</h2>
          <div class="details">
            <span class="type" v-if="vocab.type">{{ vocab.type }}</span>
            <span class="pronunciation" v-if="vocab.pronunciation || apiPronunciation">{{ vocab.pronunciation || apiPronunciation }}</span>
          </div>
          <div class="tags" v-if="vocab.tags && vocab.tags.length > 0">
            <span class="tag" v-for="tag in vocab.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </template>

      <template #back>
        <div class="flashcard-back">
          <h3 class="meaning">{{ vocab.meaning }}</h3>
          <div class="examples" v-if="vocab.examples && vocab.examples.length > 0">
            <p class="example" v-for="(example, index) in vocab.examples" :key="index">
              "{{ example }}"
            </p>
          </div>
        </div>
      </template>
    </FlipCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FlipCard } from 'vue3-flashcards'

// Nhận dữ liệu từ vựng từ component cha truyền vào
const props = defineProps({
  vocab: {
    type: Object,
    required: true
  }
})

const audioUrl = ref(null)
const apiPronunciation = ref('')
const isApiFetched = ref(false)

// Hàm dùng Web Speech API (Đọc bất chấp không cần file MP3)
const speakWithBrowserTTS = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Hoặc 'en-GB' nếu bạn thích giọng Anh-Anh
    utterance.rate = 1.0;     // Tốc độ đọc
    window.speechSynthesis.speak(utterance);
  } else {
    console.error('Trình duyệt của bạn không hỗ trợ Web Speech API');
  }
}

const handleFlip = async () => {
  if (!isApiFetched.value) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${props.vocab.word}`)
      if (response.ok) {
        const data = await response.json()
        
        // Find audio URL
        const phonetics = data[0]?.phonetics || []
        const validPhonetic = phonetics.find(p => p.audio && p.audio !== '')
        if (validPhonetic) {
          audioUrl.value = validPhonetic.audio
        }

        // Find IPA pronunciation
        const textPhonetic = phonetics.find(p => p.text && p.text !== '')
        if (textPhonetic) {
          apiPronunciation.value = textPhonetic.text
        } else if (data[0]?.phonetic) {
          apiPronunciation.value = data[0].phonetic
        }
      }
    } catch (error) {
      console.error('Lỗi khi gọi Free Dictionary API:', error)
    } finally {
      isApiFetched.value = true
    }
  }

  // LOGIC PHÁT ÂM THANH MỚI
  if (audioUrl.value) {
    // Nếu có file mp3 từ API -> Phát
    const audio = new Audio(audioUrl.value)
    audio.play().catch(e => {
      console.error("Lỗi phát audio, chuyển sang TTS trình duyệt:", e)
      speakWithBrowserTTS(props.vocab.word) // Fallback nếu file mp3 bị hỏng (404/CORS)
    })
  } else {
    // Nếu API không có file audio cho từ này -> Dùng TTS của trình duyệt đọc trực tiếp chữ đó
    speakWithBrowserTTS(props.vocab.word)
  }
}
</script>

<style scoped>
.flashcard-container {
  width: 300px;
  height: 400px;
  margin: 0 auto;
  cursor: pointer;
}

/* CSS chung cho cả 2 mặt */
.flashcard-front, .flashcard-back {
  width: 100%;
  height: 100%;
  /* FlipCard already handles backface-visibility and positioning, 
     but we need to set the height and padding of our inner content. */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  min-height: 400px;
}

/* Mặt trước */
.flashcard-front {
  background-color: #ffffff;
  color: #333;
  border: 2px solid #e0e0e0;
}

.word { font-size: 2.2rem; margin-bottom: 0.5rem; font-weight: bold; }
.details { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1rem; }
.type { font-size: 1rem; color: #130877; font-style: italic; }
.pronunciation { color: #ad0a0a; font-family: monospace; font-size: 1.1rem; }

.tags { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin-top: 1rem; }
.tag { background-color: #f0f0f0; color: #666; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; }

/* Mặt sau */
.flashcard-back {
  background-color: #4CAF50;
  color: white;
  border: 2px solid #4CAF50;
}

.meaning { font-size: 1.8rem; margin-bottom: 1.5rem; font-weight: 600; }
.examples { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; text-align: left; padding: 0 1rem; }
.example { font-size: 1.1rem; opacity: 0.95; font-style: italic; border-left: 3px solid rgba(255,255,255,0.5); padding-left: 0.5rem; }
</style>