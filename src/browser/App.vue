<template lang="pug">
  v-app
    router-view
    welcome-message
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WelcomeMessage from '@/browser/components/WelcomeMessage.vue';

@Component({
  components: {
    WelcomeMessage,
  },
})
export default class App extends Vue {
}
</script>
