<template>
    <div class="petals-container">
      <div
        v-for="(petal, index) in petals"
        :key="index"
        class="petal"
        :style="petal.style"
      ></div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        petals: [],
      };
    },
    mounted() {
      const numberOfPetals = 10; // Количество лепестков
      for (let i = 0; i < numberOfPetals; i++) {
        const size = Math.random() * 10 + 30 + 'px'; // Размер от 10 до 30px
        const left = Math.random() * 100 + '%'; // Позиция по горизонтали
        const duration = Math.random() * 5 + 5 + 's'; // Скорость от 5 до 10 секунд
        const delay = Math.random() * 5 + 's'; // Задержка до 5 секунд
  
        this.petals.push({
          style: {
            width: size,
            height: size,
            left: left,
            animationDuration: duration,
            animationDelay: delay,
          },
        });
      }
    },
  };
  </script>
  
  <style scoped>
  .petals-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Лепестки не мешают кликам */
    z-index: 10; /* На заднем плане */
  }
  
  .petal {
    position: absolute;
    background-image: url('/images/candy.png');
    background-size: cover;
    animation: fall linear infinite;
  }
  
  @keyframes fall {
    0% {
      transform: translateY(-100px) rotate(0deg);
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
    }
  }
  </style>