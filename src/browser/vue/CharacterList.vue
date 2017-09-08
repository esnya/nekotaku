<template lang="pug">
  .neko-container
    .neko-scroll.neko-fill
      v-data-table(
        :headers="headers"
        :items="characters"
        hide-actions
      ).mt-5.mb-6.elevation-1
        template(slot="items", scope="props")
            td.pa-0.td-edit
              character-edit-dialog(:character="props.item")
            td {{props.item.name}}
            td.text-xs-center {{props.item.initiative}}
            td.text-xs-center(
              v-if="room.characterAttributes"
              v-for="(attribute, index) in room.characterAttributes"
            ) {{props.item.attributes && props.item.attributes[index]}}
    .neko-fab
      character-create-dialog
</template>

<script>
import { mapState } from 'vuex';
import CharacterCreateDialog from './CharacterCreateDialog.vue';
import CharacterEditDialog from './CharacterEditDialog.vue';

export default {
  components: {
    CharacterCreateDialog,
    CharacterEditDialog,
  },
  computed: {
    ...mapState([
      'room',
      'characters',
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
      ].concat(
        (characterAttributes || []).map(attribute => ({
          text: attribute,
          align: 'center',
          sortable: false,
          value: attribute,
        })),
      );
    },
  },
  data() {
    return {
      cedOpen: {},
    };
  },
};
</script>

<style lang="stylus" scoped>
.mb-6
  margin-bottom 96px

.td-edit
  width 32px

  button
    margin-right 0
</style>
