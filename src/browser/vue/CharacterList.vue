<template lang="pug">
  div.character-list-container
    .character-table-container.mt-5.pb-5
      v-data-table(
        :headers="headers"
        :items="characters"
        hide-actions
      ).character-table.elevation-1
        template(slot="items", scope="props")
            td.pa-0.td-edit
              character-edit-dialog(:character="props.item")
            td {{props.item.name}}
            td.text-xs-center {{props.item.initiative}}
            td.text-xs-center(v-for="(attribute, index) in room.characterAttributes") {{props.item.attributes[index]}}
    .character-add
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
      } = this.room;

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
        characterAttributes.map(attribute => ({
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
.character-list-container
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;

  .character-table-container
    flex: 1 1 0;
    overflow: auto;

  .character-add
    flex: 0 0 0;
    position: relative;

.td-edit
  width: 32px;

  button
    margin-right: 0;
</style>
