<template lang="pug">
  .input-wrapper
    .input-block
      input(
        style="width: auto;"
        type='text'
        placeholder='Текст'
        :value="value"
        @input="changeInputSize"
        @blur="$event.target.disabled = true"
        :size="inputSize"
        disabled
        autofocus
      )
      .action-block(v-if="!archived")
        a(href='#'
          @click.prevent="focusOnInput"
        )
          img(src="../../assets/edit.png")
        a(href='#'
          @click.prevent="$emit('deleteWord')"
        )
          img(src="../../assets/delete.png")
</template>

<script>
export default {
  name: 'keyWord',
  props: {
    value: {
      type: String,
      default: '',
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputSize: this.value.length + 2,
    };
  },
  methods: {
    focusOnInput($event) {
      const input = $event.target.parentElement.parentElement.previousElementSibling;
      input.disabled = false;
      input.focus();
    },
    changeInputSize($event) {
      this.$emit('input', $event.target.value);
      this.inputSize = this.value.length + 2;
    }
  },
};
</script>
