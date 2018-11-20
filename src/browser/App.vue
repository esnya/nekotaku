<template lang="pug">
  v-app
    transition(name="neko-slide")
      router-view
    welcome-message
</template>

<script>
import WelcomeMessage from '@/browser/components/WelcomeMessage.vue';

export default {
  components: {
    WelcomeMessage,
  },
};
</script>
