<template>
  <div class="color-picker" :style="pickerStyle" @click="changeColor" />
</template>

<script>
export default {
  name: "ColorPicker",
  data() {
    return {
      color: this.generateColor()
    };
  },
  computed: {
    pickerStyle() {
      return {
        backgroundColor: this.color
      };
    }
  },
  methods: {
    generateColor: () => "#" + ((Math.random() * 0xffffff) << 0).toString(16),
    changeColor() {
      this.color = this.generateColor();
      this.$emit("color", this.color);
    }
  },
  mounted() {
    this.$emit("color", this.color);
  }
};
</script>

<style lang="scss" scoped>
.color-picker {
  width: 30px;
  height: 30px;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  border-radius: 25px;
  cursor: pointer;
  transition: 0.5s;
}

.color-picker:active {
  box-shadow: inset 0px 0px 5px black;
  outline: none;
}
</style>
