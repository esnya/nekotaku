<template lang="pug">
  v-app
    transition(name="neko-slide")
      router-view
    welcome-message
    loading-dialog
</template>

<script>
import LoadingDialog from '@/browser/components/LoadingDialog.vue';
import WelcomeMessage from '@/browser/components/WelcomeMessage.vue';

export default {
  components: {
    LoadingDialog,
    WelcomeMessage,
  },
};
</script>
