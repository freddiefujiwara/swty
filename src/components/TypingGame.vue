<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { parseCSV } from '../utils/textProcessor';
import { getCharClass as getCharClassLogic, isSentenceComplete } from '../utils/gameLogic';

const API_URL = 'https://script.google.com/macros/s/AKfycbzCuadMRvTEB_iNYUV6TdvGQjjN8ntmJr-2YzLY71h7y-hyIiBCz5eBzvAR9N-wgTX02w/exec';
const QUERY = '平易な英語で英文を100個CSVでください.回答はCSVのみにしてください。';

const sentences = ref([]);
const currentIndex = ref(0);
const userInput = ref('');
const loading = ref(true);
const error = ref(null);
const typingInput = ref(null);

const currentSentence = computed(() => sentences.value[currentIndex.value] || '');

const fetchSentences = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(`${API_URL}?p=${encodeURIComponent(QUERY)}`);
    if (!response.ok) throw new Error('Failed to fetch sentences');
    const data = await response.json();
    if (data.answer) {
      sentences.value = parseCSV(data.answer);
    } else {
      throw new Error('Invalid API response');
    }
  } catch (err) {
    error.value = err.message;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleInput = () => {
  if (isSentenceComplete(userInput.value, currentSentence.value)) {
    // Correctly typed the whole sentence
    // We move to next sentence immediately but wait a bit for visual feedback
    // To avoid losing input for the next sentence, we can clear userInput
    // and then increment currentIndex.
    setTimeout(() => {
      currentIndex.value++;
      userInput.value = '';
    }, 100);
  }
};

const getCharClass = (index) => {
  return getCharClassLogic(index, userInput.value, currentSentence.value);
};

const resetGame = () => {
  currentIndex.value = 0;
  userInput.value = '';
  fetchSentences();
};

const focusInput = () => {
  if (typingInput.value) {
    typingInput.value.focus();
  }
};

onMounted(() => {
  fetchSentences();
  window.addEventListener('click', focusInput);
});

onUnmounted(() => {
  window.removeEventListener('click', focusInput);
});

watch(loading, (newVal) => {
  if (!newVal) {
    setTimeout(focusInput, 100);
  }
});
</script>

<template>
  <div class="typing-game" @click="focusInput">
    <div v-if="loading" class="status-container">
      <div class="spinner"></div>
      <p>Loading sentences...</p>
    </div>

    <div v-else-if="error" class="status-container error">
      <p>Error: {{ error }}</p>
      <button @click="fetchSentences" class="retry-btn">Retry</button>
    </div>

    <div v-else-if="sentences.length > 0 && currentIndex < sentences.length" class="game-container">
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: `${(currentIndex / sentences.length) * 100}%` }"></div>
      </div>
      <div class="counter">{{ currentIndex + 1 }} / {{ sentences.length }}</div>

      <div class="sentence-display">
        <span
          v-for="(char, index) in currentSentence"
          :key="index"
          :class="getCharClass(index)"
        >{{ char }}</span>
      </div>

      <input
        ref="typingInput"
        v-model="userInput"
        type="text"
        class="hidden-input"
        @input="handleInput"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        autofocus
      />

      <div class="instruction">Type the sentence above</div>
    </div>

    <div v-else-if="sentences.length > 0" class="game-complete">
      <div class="success-icon">🎉</div>
      <h2>Well Done!</h2>
      <p>You've completed all {{ sentences.length }} sentences.</p>
      <button @click="resetGame" class="restart-btn">Try Again</button>
    </div>

    <div v-else class="status-container">
      <p>No sentences found.</p>
      <button @click="fetchSentences" class="retry-btn">Retry</button>
    </div>
  </div>
</template>

<style scoped>
.typing-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.status-container {
  text-align: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #42b983;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.game-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.counter {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2rem;
}

.sentence-display {
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 3rem;
  line-height: 1.4;
  word-break: break-word;
  text-align: center;
}

.char-correct {
  color: #42b983;
}

.char-incorrect {
  background-color: #ff5252;
  color: white;
  border-radius: 2px;
}

.char-pending {
  color: #ccc;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.instruction {
  margin-top: 2rem;
  color: #999;
  font-size: 0.9rem;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
}

.game-complete {
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.restart-btn, .retry-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.restart-btn:hover, .retry-btn:hover {
  background-color: #3aa876;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .sentence-display {
    font-size: 1.5rem;
  }
}
</style>
