<template>
  <div class="form-separator">
    <div class="line left"></div>
    <span v-if="$slots.default">
      <slot />
    </span>
    <div class="line right"></div>
  </div>
</template>

<style lang="postcss" scoped>
.form-separator {
  display: flex;
  width: 100%;
  height: auto;
  flex-flow: row nowrap;
  align-content: center;
  align-items: center;
  justify-content: center;
  padding: 5px 0;

  .line {
    flex: 1 1 auto;
    height: 1px;
    background-color: var(--bg4);
    border-radius: 3px;
  }
  span {
    padding: 5px;
    font-size: 14px;
    text-transform: uppercase;
    color: var(--bg8);
    flex: 0 0 auto;
  }
}
</style>
