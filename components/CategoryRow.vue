<template>
    <ul
        class="categories__row"
        :class="{ dragged: draggedItem?.categoryId === category.id }"
    >
        <li class="categories__row-item drag-handle">
            <LucideGripVertical
                :size="24"
                draggable="true"
                @dragstart="onDragStart($event, index, 'category')"
            />
        </li>
        <li class="categories__row-item">
            <span class="categories__row-head">№</span>
            <span class="categories__row-label">{{ index + 1 }}</span>
        </li>
        <li class="categories__row-item">
            <span class="categories__row-head">Name</span>
            <span class="categories__row-label">
                <Transition name="fade" mode="out-in">
                    <LucideFolder
                        v-if="!category.hasOpenedSubCategories"
                        class="folder-icon"
                    />
                    <LucideFolderOpen v-else />
                </Transition>
                {{ category.name }}
            </span>
        </li>
        <li class="categories__row-item">
            <span class="categories__row-head">Order</span>
            <span class="categories__row-label">{{ category.order }}</span>
        </li>
        <li class="categories__row-item">
            <span class="categories__row-head">Sub categories</span>
            <span class="categories__row-label">{{
                Boolean(category.sub_categories.length)
                    ? formatList(category.sub_categories)
                    : '-'
            }}</span>
        </li>
        <li class="categories__row-item">
            <span
                v-if="Boolean(category.sub_categories.length)"
                class="categories__row-count"
                >{{ category.sub_categories?.length }}</span
            >
        </li>
        <li class="categories__row-item actions">
            <CommonButton
                v-if="Boolean(category.sub_categories.length)"
                @click="toggleSubCategories(String(category.id))"
                variant="primary"
                size="sm"
                square
            >
                <LucideChevronDown
                    :class="{ 'rotate-180': category.hasOpenedSubCategories }"
                    :size="16"
                />
            </CommonButton>
            <DropDown :actions="dropdownActions">
                <CommonButton variant="dark-purple" size="sm" square>
                    <LucideEllipsis :size="16" />
                </CommonButton>
            </DropDown>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { LucideEdit, LucideTrash } from '#components';
import type { Category } from '~/types/categories';
import formatList from '~/utils/common';

const props = defineProps<{
    category: Category;
    index: number;
    draggedItem: any;
}>();

const emit = defineEmits(['dragstart', 'toggle', 'edit', 'remove']);

const onDragStart = (event: DragEvent, index: number, type: string) => {
    emit('dragstart', event, index, type);
};

const toggleSubCategories = (categoryId: string) => {
    emit('toggle', categoryId);
};

const dropdownActions = computed(() => [
    {
        label: 'Edit',
        icon: LucideEdit,
        handler: () => emit('edit', props.category),
    },
    {
        label: 'Remove',
        icon: LucideTrash,
        handler: () => emit('remove', String(props.category.id)),
    },
]);
</script>

<style lang="css" scoped>
.categories__row {
    display: grid;
    grid-template-columns: 32px 40px 200px 100px 1fr 40px 72px;
    gap: 16px;
    padding: 12px;
    align-items: center;
    transition: background 0.2s ease-in-out;
    width: 100%;
    border-radius: 12px;
    border: 2px dashed transparent;
}

.categories__row.dragged {
    border: 2px dashed var(--color-purple);
}

.categories__row-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.categories__row-item.actions {
    display: flex;
    flex-direction: row !important;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
}

.categories__row-head {
    color: var(--color-secondary);
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
}

.categories__row-label {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0%;
    vertical-align: middle;
    display: flex;
    align-items: center;
    gap: 4px;
}

.categories__row-count {
    background-color: #1e3c3c;
    color: var(--color-green);
    border-radius: 100px;
    padding: 0 12px;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 0%;
    vertical-align: middle;
}

.rotate-180 {
    transform: rotate(180deg);
    transition: transform 0.3s ease-in-out;
}

.folder-icon {
    color: var(--color-secondary);
}
</style>
