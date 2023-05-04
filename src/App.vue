<script setup lang="ts">
import { ref } from 'vue'

const prefersDark = ref(getColorScheme())
const hue = ref(280)
const imgUrlData = ref('')

function updateHue() {
  hue.value = parseInt(
    (document.getElementById('hue') as HTMLInputElement).value
  )

  const hueBox = document.querySelector('.hue-box') as HTMLElement
  hueBox.style.backgroundColor = `hsl(${hue.value}, 100%, 50%)`
}

function randomString(len = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return str
}

function randomImage() {
  const canvasWorker = new Worker('./workers/canvasWorker.js', {
    type: 'module'
  })

  canvasWorker.postMessage({
    type: 'init',
    data: {
      hue: hue.value
    }
  })

  canvasWorker.onmessage = (e) => {
    const message = e.data
    if (message.type === 'image') {
      const pngBlob = new Blob([message.data], { type: 'image/png' })
      imgUrlData.value = URL.createObjectURL(pngBlob)
    }
    canvasWorker.terminate()
  }
}

function getColorScheme() {
  if (!window) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

randomImage()
</script>

<template>
  <div
    class="container min-h-screen min-w-full px-3 py-4"
  >
    <div class="content flex flex-col items-center justify-start max-w-xl mx-auto">
      <div class="w-full">
        <a href="https://github.com/yevgeniyakimenko/ranpic" target="_blank" rel="noopener noreferrer">
          <template v-if="prefersDark">
            <img src="./assets/square-github-light.svg" alt="GitHub icon" class="w-10 h-10 ml-auto mb-4">
          </template>
          <template v-else>
            <img src="./assets/square-github.svg" alt="GitHub icon" class="w-10 h-10 ml-auto mb-4">
          </template>
        </a>
      </div>
      
      <h1 class="text-4xl">
        RanPic: Random Avatar Generator
      </h1>

      <div class="image-container mb-8 h-[500px]">
        <a v-if="imgUrlData" :href="imgUrlData" :download="`ranpic-${randomString()}.png`">
          <img :src="imgUrlData" alt="Generated avatar">
        </a>
        <p class="mt-2">
          Click or tap the image to save it.
        </p>
      </div>

      <form class="w-full">
        <div class="form-section flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
          <div class="flex items-center mb-4 sm:mb-auto">
            <label for="hue" class="inline-block">
              Color:
            </label>

            <div
              class="hue-box inline-block h-8 w-32 ml-2 sm:mr-4 rounded-xl"
              :style="{
                backgroundColor: `hsl(${hue}, 100%, 50%)`
              }"
            >
            </div>
          </div>

          <input
            type="range"
            name="hue"
            id="hue"
            min="0"
            max="360"
            :value="hue"
            @input="updateHue"
            class="block w-full sm:w-[360px]"
          >
        </div>

        <div class="form-section  ">
          <div class="button-container flex justify-around w-full">
            <button
              type="button"
              id="generate"
              @click="randomImage"
              class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2 px-4 rounded"
            >
              Generate
            </button>
          </div>
        </div>
      </form>

      <p class="w-full">
        <a
          href="https://yevgeniy-akimenko.ca"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-500 hover:text-gray-600"
        >
          © Yevgeniy Akimenko
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 0.5em;
}

.form-section {
  margin-bottom: 1.75em;
}

label {
  display: block;
}

input {
  display: inline-block;
}

input[type="range"]#hue {
  display: inline-block;
  appearance: none;
  border-radius: 0.25em;
  background-color: rgba(0,0,0,0.1);
  height: 0.4em;
  outline: none;
  background: linear-gradient(to right, rgb(255,0,0), rgb(255,255,0), rgb(0,255,0),rgb(0,255,255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0));
}

input[type="range"]#hue::-moz-range-thumb {
  height: 1.25em;
  width: 1.25em;
  background-color: rgba(0,0,0,0.1);
  border-radius: 2em;
  background-color: white;
  border: 0.2em solid #aaa;
  cursor: pointer;
}

input[type="range"]#hue::-webkit-slider-thumb {
  height: 1.25em;
  width: 1.25em;
  border-radius: 2em;
  appearance: none;
  background-color: white;
  border: 0.2em solid #aaa;
}
</style>
