<template>
  <th :class="[size]">
    <span v-if="isColumnString(column)" class="font-semibold">{{ column }}</span>
    <div
      v-else
      :class="{ 'cursor-pointer': column.key }"
      class="flex flex-nowrap items-center select-none"
      @click="handleSort"
    >
      <span class="font-semibold">{{ column.text }}</span>
      <div v-if="column.key" class="center flex flex-col flex-nowrap ml-2">
        <SvgIcon
          src="table/table_sort_up"
          :width="8"
          :color="{ 'var(--text1)': isSorting && isSorting === 'ASC', 'var(--text5)': true }"
        />
        <SvgIcon
          class="mt-1"
          src="table/table_sort_down"
          :width="8"
          :color="{
            'var(--text1)': isSorting && isSorting === 'DESC',
            'var(--text5)': true,
          }"
        />
      </div>
    </div>
  </th>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator';
import { TableColumn, ColumnExtended, OrderByDirection } from '@models';

@Component
export default class Column extends Vue {
  @Prop({ required: true }) column!: TableColumn;
  @Prop() sortingBy?: ColumnExtended;
  @Prop() size!: 'sm' | 'md' | 'lg';

  @Emit('sort')
  emitSort(order: OrderByDirection) {
    if (typeof this.column !== 'string') {
      return {
        ...this.column,
        order,
      };
    }
  }

  get isSorting(): boolean | OrderByDirection {
    if (typeof this.column !== 'string') {
      if (this.sortingBy?.key === this.column.key) {
        return this.sortingBy?.order ?? false;
      }
      return false;
    }
    return false;
  }

  isColumnString(column: TableColumn): column is string {
    return typeof this.column === 'string';
  }

  handleSort() {
    if (typeof this.column !== 'string') {
      if (this.sortingBy?.key !== this.column.key) {
        this.emitSort(OrderByDirection.Asc);
      } else if (this.sortingBy?.key === this.column.key) {
        if (this.sortingBy?.order === OrderByDirection.Asc) {
          this.emitSort(OrderByDirection.Desc);
        } else if (this.sortingBy?.order === OrderByDirection.Desc) {
          this.$emit('clear');
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
th {
  padding: 15px;
  text-align: left;
  z-index: 10;

  &.sm {
    padding: 5px 10px;
    font-size: 14px;
  }

  &.md {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
