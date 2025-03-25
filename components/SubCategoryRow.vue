<template>
    <ul class="subcategories__row" :class="{ selected: isSelected }">
        <li class="categories__row-item drag-handle">
            <LucideGripVertical :size="24" />
        </li>

        <li class="categories__row-item">
            <span class="categories__row-head">&#8470;</span>
            <span class="categories__row-label">
                {{ categoryIndex + 1 }}.{{ subIndex + 1 }}
            </span>
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
            <div class="order-control">
                <input
                    type="number"
                    :value="subCategory.order"
                    min="1"
                    :max="maxOrder"
                    class="order-input"
                    @change="handleOrderChange($event)"
                />
                <div class="order-buttons">
                    <button
                        class="order-button"
                        @click="changeOrder('up')"
                        :disabled="subCategory.order <= 1"
                    >
                        <LucideChevronUp :size="14" />
                    </button>
                    <button
                        class="order-button"
                        @click="changeOrder('down')"
                        :disabled="subCategory.order >= maxOrder"
                    >
                        <LucideChevronDown :size="14" />
                    </button>
                </div>
            </div>
        </li>

        <li class="categories__row-item"></li>

        <li class="categories__row-item actions">
            <CommonButton
                :variant="isSelected ? 'primary-light' : 'dark-purple'"
                size="sm"
                square
                @click.stop="$emit('menu', subCategory.id)"
                class="menu-button"
            >
                <LucideEllipsis :size="16" />
            </CommonButton>
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { SubCategory } from '~/types/categories';

// Props
const props = defineProps<{
    subCategory: SubCategory;
    categoryIndex: number;
    subIndex: number;
    maxOrder: number;
    isSelected?: boolean;
}>();

// Emits
const emit = defineEmits<{
    (e: 'menu', id: number): void;
    (e: 'order-change', subCategoryId: number, newOrder: number): void;
}>();

// Methods
const handleOrderChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const newOrder = parseInt(input.value);

    if (isNaN(newOrder) || newOrder < 1 || newOrder > props.maxOrder) {
        // Reset to current value if invalid
        input.value = props.subCategory.order.toString();
        return;
    }

    emit('order-change', props.subCategory.id, newOrder);
};

const changeOrder = (direction: 'up' | 'down') => {
    const currentOrder = props.subCategory.order;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

    if (newOrder < 1 || newOrder > props.maxOrder) {
        return;
    }

    emit('order-change', props.subCategory.id, newOrder);
};
</script>

<style lang="css" scoped>
.subcategories__row {
    display: grid;
    grid-template-columns: 32px 40px 200px 100px 1fr 72px;
    gap: 16px;
    background-color: var(--color-gray-800);
    padding: 12px;
    border-radius: 6px;
    align-items: center;
    transition: background 0.2s ease-in-out;
    width: 100%;
    margin-left: 16px;
}

.subcategories__row.selected {
    background-color: #2d2b43;
}

.categories__row-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.categories__row-item.drag-handle {
    cursor: grab;
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

.order-control {
    display: flex;
    align-items: center;
    gap: 8px;
}

.order-input {
    width: 50px;
    background-color: var(--color-gray-700);
    border: 1px solid var(--color-gray-600);
    border-radius: 4px;
    padding: 4px 8px;
    color: var(--color-white);
    font-size: 14px;
    text-align: center;
}

.selected .order-input {
    background-color: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
}

.order-buttons {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.order-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-gray-700);
    border: 1px solid var(--color-gray-600);
    border-radius: 4px;
    width: 20px;
    height: 20px;
    padding: 0;
    cursor: pointer;
}

.selected .order-button {
    background-color: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
}

.order-button:hover:not(:disabled) {
    background-color: var(--color-gray-600);
}

.order-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.menu-button {
    transition: all 0.2s ease-in-out;
}

.selected .menu-button {
    background-color: rgba(79, 70, 229, 0.3);
}
</style>
