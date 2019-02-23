<template lang="pug">
  room-container(v-if="!notFound")
  not-found(v-else)
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import RoomContainer from '@/browser/moleculers/RoomContainer.vue';
import memberDAO from '@/browser/dao/memberDAO';
import UnauthorizedError from '@/browser/backend/UnauthorizedError';
import NotFoundError from '@/browser/backend/NotFoundError';
import NotFound from '@/browser/moleculers/NotFound.vue';
import { RoomPassword } from '@/browser/routes';

@Component({
  components: {
    NotFound,
    RoomContainer,
  },
})
export default class RoomPage extends Vue {
  notFound: boolean = false;

  async created() {
    try {
      await memberDAO.update({
        name: 'ななしさん',
        color: '#000000',
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) this.$router.push({ name: RoomPassword.name });
      else if (e instanceof NotFoundError) this.notFound = true;
      else {
        alert(e.toString());
      }
    }
  }
}
</script>
