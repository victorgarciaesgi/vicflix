<template>
  <div v-if="filteredList.length || $slots.customRender" class="c-row-y flex w-full overflow-auto">
    <table class="tableGrid" :class="[size]">
      <thead>
        <tr>
          <Column
            v-for="(column, index) of columns"
            :key="index"
            :column="column"
            :sorting-by="selectedSort"
            :size="size"
            @sort="handleColumnSort"
            @clear="handleColumnClear"
          />
        </tr>
      </thead>
      <tbody v-if="$scopedSlots.default" class="text-base">
        <template v-for="(data, index) of filteredList">
          <tr :key="index">
            <slot :data="data" :index="index"></slot>
          </tr>
          <tr v-if="gap" :key="index" :style="`height: ${gap}px`"></tr>
        </template>
      </tbody>
      <tbody v-else-if="$slots.customRender">
        <slot name="customRender"></slot>
      </tbody>
    </table>
  </div>
  <div v-else-if="!loading" class="message flex flex-col w-full">
    <div class="center flex">
      <span class="px-10 py-20 text-center">
        {{ message }}
      </span>
    </div>
  </div>
  <div v-else style="min-height: 200px"> </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'nuxt-property-decorator';
import { TableColumn, ColumnExtended, ObjectLiteral, OrderByDirection } from '@models';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash-es';
import Column from './Column.vue';

enum IOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

@Component({
  components: {
    Column,
  },
})
export default class TableGrid extends Vue {
  @Prop({ required: true }) columns!: TableColumn[];
  @Prop({ required: false }) gridData?: any[];
  @Prop({ required: false }) gap?: number;
  @Prop({ default: 'Aucun résultat à afficher', required: false }) message?: string;
  @Prop({ default: false, required: false }) localOrder!: boolean;
  @Prop({ required: false }) loading?: boolean;
  @Prop({ default: 'md', required: false }) size!: 'sm' | 'md' | 'lg';
  @Prop({ required: false }) draggableOptions!: any;
  @PropSync('orderBy', { required: false }) selectedSort!: ColumnExtended | null;
  @Prop({ required: false }) defaultSort?: ColumnExtended;

  get filteredList() {
    if (this.gridData) {
      let sortedList = cloneDeep(this.gridData);

      if (this.localOrder) {
        if (this.selectedSort) {
          sortedList = this.gridData.concat().sort((a, b) => {
            if (this.selectedSort && this.selectedSort.key) {
              const orderBy = this.selectedSort.order;
              const keyA = a[this.selectedSort.key];
              const keyB = b[this.selectedSort.key];

              if (this.selectedSort.type === 'numeric') {
                return orderBy === OrderByDirection.Asc ? keyA - keyB : keyB - keyA;
              } else if (this.selectedSort.type === 'date') {
                if (orderBy === OrderByDirection.Asc) {
                  return new Date(keyA).getTime() - new Date(keyB).getTime();
                } else {
                  return new Date(keyB).getTime() - new Date(keyA).getTime();
                }
              }
              return orderBy === OrderByDirection.Asc
                ? keyA.localeCompare(keyB)
                : keyB.localeCompare(keyA);
            } else {
              return a - b;
            }
          });
        }
      }
      return sortedList.map((data) => {
        return Object.keys(data).reduce((obj, key) => {
          const formateur = this.columns.find(
            (f) => typeof f !== 'string' && f.key === key && !!f.format
          );
          if (typeof formateur !== 'string' && formateur?.type === 'date' && formateur?.format) {
            obj[key] = format(new Date(data[key]), formateur.format);
          } else {
            obj[key] = data[key];
          }
          return obj;
        }, {});
      });
    }
    return [];
  }

  get isColumnString() {
    return (column: ColumnExtended) => typeof column === 'string';
  }

  get columnsCount() {
    return this.columns.length;
  }

  handleColumnSort(column: ColumnExtended) {
    this.selectedSort = column;
    this.$emit('sort', column);
  }
  handleColumnClear() {
    this.selectedSort = this.defaultSort ?? null;
    this.$emit('clear');
  }
}
</script>

<style lang="postcss">
table.tableGrid {
  @apply rounded;
  min-width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: var(--bg1);
  position: relative;

  tbody {
    overflow-y: auto;
    position: relative;

    tr {
      td {
        padding: 15px;
        max-width: 250px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      &:nth-child(even) {
        background-color: var(--bg2);
      }
      &:nth-child(odd) {
        background-color: var(--bg1);
      }
    }
  }

  &.sm {
    tbody {
      tr {
        td {
          padding: 5px 10px;
          max-width: 150px;
          font-size: 14px;
        }
      }
    }
  }

  &.md {
    tbody {
      tr {
        td {
          padding: 10px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
