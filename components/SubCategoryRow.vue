<template>
    <ul
        class="subcategories__row"
        draggable="true"
        @dragstart.stop="
            onDragStart($event, categoryId, 'subcategory', subCategory.id)
        "
        @dragover.prevent
        @drop="onDrop($event, categoryId, 'subcategory', subCategory.id)"
    >
        <li class="categories__row-item drag-handle">
            <LucideGripVertical
                :size="24"
                draggable="true"
                @dragstart.stop="
                    onDragStart(
                        $event,
                        categoryId,
                        'subcategory',
                        subCategory.id
                    )
                "
            />
        </li>
        <li class="categories__row-item">
            <span class="categories__row-head">№</span>
            <span class="categories__row-label"
                >{{ parentIndex + 1 }}.{{ subIndex + 1 }}</span
            >
        </li>
        <li class="categories__row-item">
            <span class="categories__row-head">Name</span>
            <span class="categories__row-label">
                <LucideFile />
                {{ subCategory.name }}
            </span>
        </li>
        <li class="categories__row-item">
            <span class="categories__row-head">Order</span>
            <span class="categories__row-label">{{ subCategory.order }}</span>
        </li>
        <li class="categories__row-item actions">
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
const props = defineProps<{
    subCategory: any;
    categoryId: number;
    parentIndex: number;
    subIndex: number;
}>();

const emit = defineEmits(['dragstart', 'drop', 'edit', 'remove']);

const onDragStart = (
    event: DragEvent,
    categoryId: number,
    type: string,
    subId?: number
) => {
    emit('dragstart', event, categoryId, type, subId);
};

const onDrop = (
    event: DragEvent,
    categoryId: number,
    type: string,
    subId?: number
) => {
    emit('drop', event, categoryId, type, subId);
};

const dropdownActions = computed(() => [
    {
        label: 'Edit',
        icon: LucideEdit,
        handler: () => emit('edit', props.subCategory),
    },
    {
        label: 'Remove',
        icon: LucideTrash,
        handler: () =>
            emit(
                'remove',
                String(props.categoryId),
                String(props.subCategory.id)
            ),
    },
]);
</script>

<style lang="css" scoped>
.subcategories__row {
    display: grid;
    grid-template-columns: 32px 40px 200px 1fr 32px;
    gap: 16px;
    background-color: var(--color-gray-800);
    padding: 12px;
    border-radius: 6px;
    align-items: center;
    transition: background 0.2s ease-in-out;
    width: 100%;
}

.subcategories__row.dragged {
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

.rotate-180 {
    transform: rotate(180deg);
    transition: transform 0.3s ease-in-out;
}

.folder-icon {
    color: var(--color-secondary);
}
</style>
