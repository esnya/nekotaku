<template lang="pug">
  #app
    v-app
      transition(name="neko-slide")
        router-view
      welcome-message
</template>

<script>
import WelcomeMessage from './WelcomeMessage.vue';

export default {
  components: {
    WelcomeMessage,
  },
};
</script>

