<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories';
import type { Category } from '~/types/categories';
import { HistoryActionEvents } from '~/types/common';

interface Props {
    count: number;
}

interface Emits {
    (e: 'action', action: HistoryActionEvents): void;
}

const emits = defineEmits<Emits>();

defineProps<Props>();

const showModal = ref(false);

const categoriesStore = useCategoriesStore();

const handleSave = (category: Category) => {
    showModal.value = false;
    categoriesStore.addCategory(category)
};
</script>

<template>
    <header class="header">
        <div class="header__info">
            <h1 class="header__title">Games List</h1>

            <span class="header__badge">Found: {{ count }}</span>
        </div>

        <div class="header__actions">
            <!-- <CommonButton
                variant="secondary"
                size="sm"
                @click="emits('action', HistoryActionEvents.UNDO)"
                square
            >
                <LucideArrowLeft :size="16" />
            </CommonButton>

            <CommonButton
                variant="secondary"
                size="sm"
                @click="emits('action', HistoryActionEvents.REDO)"
                square
            >
                <LucideArrowRight :size="16" />
            </CommonButton> -->
            <CommonButton variant="primary" size="sm" @click="showModal = true">
                <LucidePlus :size="16" />
                Add
            </CommonButton>
        </div>
    </header>

    <ModalEdit
        v-model="showModal"
        @save="handleSave"
        @cancel="showModal = false"
    />
</template>

<style lang="css" scoped>
.header {
    display: flex;
    justify-content: space-between;
}

.header__info {
    display: flex;
    align-items: center;
    gap: 14px;
}

.header_title {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    vertical-align: middle;
}

.header__badge {
    background: var(--color-green);
    color: var(--color-dark);
    font-size: 12px;
    line-height: 14px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 14px;
}

.header__actions {
    display: flex;
    align-items: center;
    gap: 12px;
}
</style>
