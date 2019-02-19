<template lang="pug">
  card-dialog(title="ログ保存" :value="value" @input="$emit('input', $event)")
    log-type-select(v-model="type")
    log-show-timestamp-checkbox(:type="type" v-model="showTimestamp")
    template(slot="actions")
      save-button(color="primary" @click="save")
      close-button(@click="$emit('input', false)")
</template>

<script>
import CardDialog from '@/browser/atoms/CardDialog.vue';
import CloseButton from '@/browser/atoms/CloseButton.vue';
import LogShowTimestampCheckbox from '@/browser/atoms/LogShowTimestampCheckbox.vue';
import LogTypeSelect from '@/browser/atoms/LogTypeSelect.vue';
import SaveButton from '@/browser/atoms/SaveButton.vue';
import _ from 'lodash';
import moment from 'moment';

const ContainerTemplate = {
  txt: '<%= messages %>',
  html: [
    '<!DOCTYPE html>',
    '<html lang="ja">',
    '<head>',
    '<meta charset="UTF-8">',
    '<title><%= title %></title>',
    '<style>td { vertical-align: top; }</style>',
    '</head>',
    '<h1><%= title %></h1>',
    '<table><tbody>',
    '<%= messages %>',
    '</tbody></table>',
    '</body>',
    '</html>',
  ].join(''),
};
const MessageTemplate = {
  txt: '<%= name%>:\t<%= message %>\t<%= timestamp %>',
  html: [
    '<tr style="color: <%= color %>;">',
    '<td><%= name %></td>',
    '<td><%= messageWithBr %></td>',
    '<td><%= timestamp %></td>',
    '</tr>',
  ].join(''),
};

function render(type, messages, room, options) {
  if (type === 'json') return JSON.stringify({ messages, room }, null, '  ');

  const {
    showTimestamp,
  } = options;

  const renderedMessages = messages.map((message) => {
    const data = {
      ...message,
      message: message.body.map(b => b.text).join(' '),
      messageWithBr: message.body.map(b => b.text).join('<br>'),
      timestamp: showTimestamp ? moment(message.createdAt).format('lll') : '',
    };
    return _.template(MessageTemplate[type])(data);
  }).join('\r\n');

  const data = {
    title: room.title,
    messages: renderedMessages,
  };
  return _.template(ContainerTemplate[type])(data);
}

export default {
  components: {
    CardDialog,
    CloseButton,
    LogShowTimestampCheckbox,
    LogTypeSelect,
    SaveButton,
  },
  data: () => ({
    type: 'html',
    showTimestamp: true,
  }),
  methods: {
    save() {
      const {
        type,
        messages,
        room,
        showTimestamp,
      } = this;

      const text = render(type, messages, room, { showTimestamp });
      const blob = new Blob([text]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.room.title}.${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
  props: {
    messages: {
      required: true,
      type: Array,
    },
    room: {
      required: true,
      type: Object,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
