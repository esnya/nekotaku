export default function modelWrapper(type: Object, required: boolean): Object {
  return {
    methods: {
      onInput(event: Event) {
        this.$emit('input', event);
      },
    },
    props: {
      value: {
        required,
        type,
      },
    },
  };
}
