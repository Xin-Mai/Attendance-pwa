<template>
  <div id="footer">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from 'vue';

export default defineComponent({
  name: 'CommonFooter',
  props: {
    // 以此取代v-show来做上移下移出现
    show: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const footer: Ref<HTMLDivElement | null> = ref(null);
    onMounted(() => {
      footer.value = document.getElementById('footer') as HTMLDivElement;
      if (props.show) {
        footer.value.style.transform = 'translateY(0)';
      }
    });
    watch(
      () => props.show,
      () => {
        console.log('watch', footer.value);
        if (!footer.value) return;
        if (props.show) {
          footer.value.style.transform = 'translateY(0)';
        } else {
          footer.value.style.transform = '';
        }
      },
      {
        immediate: true,
      }
    );
    return {};
  },
});
</script>

<style scoped>
#footer {
  z-index: 2;
  width: 100%;
  min-height: 3rem;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: white;
  box-shadow: 0px -5px 5px #f0f0f0;
  text-align: right;
  transform: translateY(100%);
  transition: transform 1s;
}
</style>
