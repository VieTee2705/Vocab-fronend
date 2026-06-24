<template>
  <div class="flashcard-container">
    <FlipCard flipAxis="y">
      <template #front>
        <div class="flashcard-front">
          <h2 class="word">{{ vocab.word }}</h2>
          <span class="pronunciation">{{ vocab.pronunciation }}</span>
        </div>
      </template>

      <template #back>
        <div class="flashcard-back">
          <h3 class="meaning">{{ vocab.meaning }}</h3>
          <p class="example" v-if="vocab.examples && vocab.examples.length > 0">"{{ vocab.examples[0] }}"</p>
        </div>
      </template>
    </FlipCard>
  </div>
</template>

<script setup>
import { FlipCard } from 'vue3-flashcards'

// Nhận dữ liệu từ vựng từ component cha truyền vào
const props = defineProps({
  vocab: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.flashcard-container {
  width: 300px;
  height: 400px;
  margin: 0 auto;
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

.word { font-size: 2rem; margin-bottom: 0.5rem; }
.pronunciation { color: #666; font-style: italic; }

/* Mặt sau */
.flashcard-back {
  background-color: #4CAF50;
  color: white;
  border: 2px solid #4CAF50;
}

.meaning { font-size: 1.5rem; margin-bottom: 1rem; }
.example { font-size: 1rem; opacity: 0.9; }
</style>