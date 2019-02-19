<template lang="pug">
  v-tabs(
    :value="tab"
    @change="selectTab"
  )
    chat-configuration-tab(
      :key="config.id"
      :configuration="config"
      v-for="config in chatConfigList"
    )
    add-icon-button(@click="addChatConfig")
    v-tab-item(
      :key="config.id"
      :configuration="config"
      v-for="config in chatConfigList"
    )
      chat-configuration-form(
        :value="config"
        @delete="deleteChatConfig(config.id)"
        @input="updateChatConfig($event)"
      )
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AddIconButton from '@/browser/atoms/AddIconButton.vue';
import ChatConfigurationForm from '@/browser/moleculers/ChatConfigurationForm.vue';
import ChatConfigurationTab from '@/browser/moleculers/ChatConfigurationTab.vue';

export default {
  components: {
    AddIconButton,
    ChatConfigurationForm,
    ChatConfigurationTab,
  },
  computed: {
    ...mapGetters([
      'chatConfigList',
      'selectedChatId',
    ]),
    tab() {
      const {
        chatConfigList,
        selectedChatId,
      } = this;
      const index = chatConfigList.findIndex(c => c.id === selectedChatId);

      return index < 0 ? 0 : index;
    },
  },
  methods: {
    ...mapActions([
      'addChatConfig',
      'deleteChatConfig',
      'selectChatConfig',
      'updateChatConfig',
    ]),
    selectTab(index) {
      const {
        chatConfigList,
      } = this;
      const configuration = chatConfigList[index];
      if (!configuration) return;

      this.selectChatConfig(configuration.id);
    },
  },
};
</script>
