<template lang="pug">
  v-container.pa-0
    v-layout(column fluid v-scroll="'all'")
      v-card.mt-4
        v-data-table(
          :headers="headers"
          :items="characters"
          hide-actions
        )
          template(slot="items", scope="props")
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
              v-btn(primary flat @click.stop="ccdOpen = true")
                v-icon add
    character-create-dialog(v-model="ccdOpen")
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
</style>
