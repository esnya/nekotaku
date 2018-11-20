<template lang="pug">
  v-container.pa-0.pb-5
    loading(v-if="charactersLoading && false")
    v-card.mt-5.mb-4(v-else)
      v-data-table(
        hide-actions
        :headers="headers"
        :items="characters"
      )
        template(slot="items" slot-scope="props")
            td.pa-0.td-edit
              character-edit-dialog(:character="props.item")
            td {{props.item.name}}
            td.text-xs-center {{props.item.initiative}}
            td.text-xs-center(
              v-if="room.characterAttributes"
              v-for="(attribute, index) in room.characterAttributes"
            ) {{props.item.attributes && props.item.attributes[index]}}
        template(slot="footer")
          td.text-xs-center(colspan="100%")
            v-btn(color="primary" flat block @click.stop="ccdOpen = true")
              v-icon add
    character-create-dialog(v-model="ccdOpen")
</template>

<script>
import { mapState } from 'vuex';
import CharacterCreateDialog from '@/browser/components/CharacterCreateDialog.vue';
import CharacterEditDialog from '@/browser/components/CharacterEditDialog.vue';
import Loading from '@/browser/components/Loading.vue';

export default {
  components: {
    CharacterCreateDialog,
    CharacterEditDialog,
    Loading,
  },
  computed: {
    ...mapState([
      'room',
      'characters',
      'charactersLoading',
    ]),
    headers() {
      const {
        characterAttributes,
      } = this.room || {};

      return [
        {
          sortable: false,
        },
        {
          text: '名前',
          align: 'center',
          sortable: true,
          value: 'name',
        },
        {
          text: 'イニシアチブ',
          align: 'center',
          sortable: true,
          value: 'initiative',
        },
      ].concat((characterAttributes || []).map(attribute => ({
        text: attribute,
        align: 'center',
        sortable: false,
        value: attribute,
      })));
    },
  },
  data() {
    return {
      ccdOpen: false,
      cedOpen: {},
    };
  },
};
</script>

<style lang="stylus" scoped>
.td-edit
  width 32px

  button
    margin-right 0

.card
  margin-bottom 56px
</style>
