<script setup>
import TypingGame from './components/TypingGame.vue'
</script>

<template>
  <main>
    <header>
      <h1>English Typing</h1>
    </header>
    <TypingGame />
    <footer>
      <p>Clean & Simple Typing Practice</p>
    </footer>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  justify-content: space-between;
}

header h1 {
  font-weight: 300;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  margin-bottom: 3rem;
  opacity: 0.8;
}

footer {
  margin-top: 4rem;
  opacity: 0.5;
  font-size: 0.8rem;
}
</style>
