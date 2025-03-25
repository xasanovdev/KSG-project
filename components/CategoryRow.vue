<template>
    <ul class="categories__row" :class="{ 'selected': isSelected }">
        <li class="categories__row-item drag-handle">
            <LucideGripVertical :size="24"/>
        </li>

        <li class="categories__row-item">
            <span class="categories__row-head">&#8470;</span>
            <span class="categories__row-label">{{ index + 1 }}</span>
        </li>
        
        <li class="categories__row-item">
            <span class="categories__row-head">Name</span>
            <span class="categories__row-label">
                <Transition name="fade" mode="out-in">
                    <LucideFolder
                        v-if="!isExpanded"
                        class="folder-icon"
                    />
                    <LucideFolderOpen v-else />
                </Transition>
                {{ category.name }}
            </span>
        </li>
        
        <li class="categories__row-item">
            <span class="categories__row-head">Order</span>
            <div class="order-control">
                <input 
                    type="number" 
                    :value="category.order" 
                    min="1" 
                    :max="maxOrder"
                    class="order-input"
                    @change="handleOrderChange($event)"
                />
                <div class="order-buttons">
                    <button 
                        class="order-button" 
                        @click="changeOrder('up')"
                        :disabled="category.order <= 1"
                    >
                        <LucideChevronUp :size="14" />
                    </button>
                    <button 
                        class="order-button" 
                        @click="changeOrder('down')"
                        :disabled="category.order >= maxOrder"
                    >
                        <LucideChevronDown :size="14" />
                    </button>
                </div>
            </div>
        </li>
        
        <li class="categories__row-item">
            <span class="categories__row-head">Sub categories</span>
            <span class="categories__row-label">
                <template v-if="category.sub_categories && category.sub_categories.length">
                    {{ formattedSubCategories }}
                </template>
                <template v-else>-</template>
            </span>
        </li>
        
        <li class="categories__row-item">
            <span class="categories__row-count" :class="{ 'green': isSelected }">
                {{ subCategoriesCount }}
            </span>
        </li>

        <li class="categories__row-item actions">
            <CommonButton
                @click.stop="$emit('toggle')"
                :variant="isSelected ? 'primary-light' : 'primary'"
                size="sm"
                square
                class="toggle-button"
            >
                <LucideChevronDown
                    :class="{ 'rotate-180': isExpanded }"
                    :size="16"
                />
            </CommonButton>
            <CommonButton 
                :variant="isSelected ? 'primary-light' : 'dark-purple'"
                size="sm"
                square
                @click.stop="$emit('menu', category.id)"
                class="menu-button"
            >
                <LucideEllipsis :size="16" />
            </CommonButton>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Category } from '~/types/categories';
import formatList from '~/utils/common';

// Props
const props = defineProps<{
    category: Category;
    index: number;
    subCategoriesCount: number;
    isExpanded: boolean;
    maxOrder: number;
    isSelected?: boolean;
}>();

// Emits
const emit = defineEmits<{
    (e: 'toggle'): void;
    (e: 'menu', id: number): void;
    (e: 'order-change', categoryId: number, newOrder: number): void;
}>();

// Computed
const formattedSubCategories = computed(() => {
    return formatList(props.category.sub_categories);
});

// Methods
const handleOrderChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const newOrder = parseInt(input.value);
    
    if (isNaN(newOrder) || newOrder < 1 || newOrder > props.maxOrder) {
        // Reset to current value if invalid
        input.value = props.category.order.toString();
        return;
    }
    
    emit('order-change', props.category.id, newOrder);
};

const changeOrder = (direction: 'up' | 'down') => {
    const currentOrder = props.category.order;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    if (newOrder < 1 || newOrder > props.maxOrder) {
        return;
    }
    
    emit('order-change', props.category.id, newOrder);
};
</script>

<style lang="css" scoped>
.categories__row {
    display: grid;
    grid-template-columns: 32px 40px 200px 100px 1fr 40px 72px;
    gap: 16px;
    background-color: var(--color-gray-900);
    padding: 12px;
    border-radius: 6px;
    align-items: center;
    transition: background 0.2s ease-in-out;
    width: 100%;
}

.categories__row.selected {
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

.categories__row-count.green {
    background-color: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.order-control {
    display: flex;
    align-items: center;
    gap: 8px;
}

.order-input {
    width: 50px;
    background-color: var(--color-gray-800);
    border: 1px solid var(--color-gray-700);
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
    background-color: var(--color-gray-800);
    border: 1px solid var(--color-gray-700);
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
    background-color: var(--color-gray-700);
}

.order-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.rotate-180 {
    transform: rotate(180deg);
    transition: transform 0.3s ease-in-out;
}

.folder-icon {
    color: var(--color-secondary);
}

.toggle-button, .menu-button {
    transition: all 0.2s ease-in-out;
}

.selected .toggle-button {
    background-color: rgba(79, 70, 229, 0.3);
}

.selected .menu-button {
    background-color: rgba(79, 70, 229, 0.3);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>