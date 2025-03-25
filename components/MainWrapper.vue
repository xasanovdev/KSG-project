<template>
    <main class="container">
        <Header @action="actions" :count="categories?.length" />

        <section class="categories__list">
            <div class="categories__tbody">
                <div
                    v-for="(category, index) in categories"
                    :key="category.id"
                    class="category-container"
                    draggable="true"
                    @dragstart="onDragStart($event, category.id, 'category')"
                    @dragover.prevent
                    @drop="onDrop($event, category.id, 'category')"
                    :class="{
                        dragged:
                            draggedItem?.categoryId === category.id &&
                            draggedItem.type === 'subcategory',
                    }"
                >
                    <CategoryRow
                        :category="category"
                        :index="index"
                        :dragged-item="draggedItem"
                        @dragstart="onDragStart"
                        @toggle="toggleSubCategories"
                        @edit="handleEdit"
                        @remove="handleRemove"
                    />

                    <Transition name="slide-fade">
                        <section
                            v-if="category.hasOpenedSubCategories"
                            class="subcategories__list"
                        >
                            <SubCategoryRow
                                v-for="(
                                    sub_category, sub_index
                                ) in category.sub_categories"
                                :key="sub_category.id"
                                :sub-category="sub_category"
                                :category-id="category.id"
                                :parent-index="index"
                                :sub-index="sub_index"
                                @dragstart="onDragStart"
                                @drop="onDrop"
                                @edit="handleEdit"
                                @remove="handleRemove"
                            />
                        </section>
                    </Transition>
                </div>
            </div>
        </section>

        <LazyModalWarning
            v-model="warningDeleteModal"
            title="Are you sure?"
            subtitle="Do you really want to delete?"
            @confirm="removeCategory"
            @cancel="warningDeleteModal = false"
        />

        <LazyModalEdit
            v-model="showEditModal"
            :category="selectedCategory"
            @save="updateCategory"
            @cancel="showEditModal = false"
        />
    </main>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories';
import type { Category } from '~/types/categories';
import type { HistoryActionEvents } from '~/types/common';

const categoriesStore = useCategoriesStore();
const categories = ref<Category[]>([]);

const showEditModal = ref(false);
const warningDeleteModal = ref(false);
const selectedCategoryId = ref<string | null>(null);
const selectedSubCategoryId = ref<string | null>(null);
const selectedCategory = ref<Category | null>(null);
const draggedItem = ref<{
    categoryId: number;
    type: 'category' | 'subcategory';
    subId?: number;
} | null>(null);

const actions = (action: HistoryActionEvents) => {};

const toggleSubCategories = (categoryId: string) => {
    const categoryIndex = categories.value.findIndex(
        (item) => String(item.id) === categoryId
    );
    if (categoryIndex !== -1) {
        categories.value[categoryIndex].hasOpenedSubCategories =
            !categories.value[categoryIndex].hasOpenedSubCategories;
    }
};

// Drag and Drop handlers remain the same
const onDragStart = (
    event: DragEvent,
    categoryId: number,
    type: 'category' | 'subcategory',
    subId?: number
) => {
    draggedItem.value = { categoryId, type, subId };
    event.dataTransfer?.setData(
        'text/plain',
        JSON.stringify(draggedItem.value)
    );
};

const onDrop = (
    event: DragEvent,
    targetCategoryId: number,
    type: 'category' | 'subcategory',
    targetSubId?: number
) => {
    event.preventDefault();
    if (!draggedItem.value) return;

    const { categoryId, subId } = draggedItem.value;

    if (type === 'category' && draggedItem.value.type === 'category') {
        const fromIndex = categories.value.findIndex(
            (cat) => cat.id === categoryId
        );
        const toIndex = categories.value.findIndex(
            (cat) => cat.id === targetCategoryId
        );

        if (fromIndex !== -1 && toIndex !== -1) {
            const [movedCategory] = categories.value.splice(fromIndex, 1);
            categories.value.splice(toIndex, 0, movedCategory);
            categories.value.forEach((cat, index) => (cat.order = index + 1));
        }
    } else if (
        type === 'subcategory' &&
        draggedItem.value.type === 'subcategory' &&
        subId !== undefined &&
        targetSubId !== undefined
    ) {
        const category = categories.value.find((cat) => cat.id === categoryId);
        if (category && category.sub_categories) {
            const fromIndex = category.sub_categories.findIndex(
                (sub) => sub.id === subId
            );
            const toIndex = category.sub_categories.findIndex(
                (sub) => sub.id === targetSubId
            );

            if (fromIndex !== -1 && toIndex !== -1) {
                const [movedSubcategory] = category.sub_categories.splice(
                    fromIndex,
                    1
                );
                category.sub_categories.splice(toIndex, 0, movedSubcategory);
                category.sub_categories.forEach(
                    (sub, index) => (sub.order = index + 1)
                );
            }
        }
    }

    categoriesStore.reorderCategories(categories.value);
    draggedItem.value = null;
};

const handleEdit = (category: Category) => {
    selectedCategory.value = category;
    showEditModal.value = true;
};

const updateCategory = (category: Category) => {
    categoriesStore.updateCategory(category.id, category).finally(() => {
        showEditModal.value = false;
    })
};

const removeCategory = () => {
    if (selectedCategoryId.value) {
        categoriesStore
            .deleteCategory(
                selectedCategoryId.value,
                selectedSubCategoryId.value
            )
            .finally(() => {
                selectedCategoryId.value = null;
                warningDeleteModal.value = false;
            });
    }
};

const handleRemove = (categoryId: string, subId?: string) => {
    warningDeleteModal.value = true;
    selectedCategoryId.value = categoryId;
    selectedSubCategoryId.value = subId ?? null;
};

onMounted(() => {
    categoriesStore.fetchCategories();
});

watch(
    () => categoriesStore.categories,
    () => {
        categories.value = categoriesStore.categories.map((category) => ({
            ...category,
            hasOpenedSubCategories: false,
        }));
    },
    { deep: true }
);
</script>

<style lang="css" scoped>
.category-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 6px;
    background-color: var(--color-gray-900);
}

.category-container.dragged {
    background-color: var(--color-dark-purple);
}

.subcategories__list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.categories__list {
    width: 100%;
    margin-top: 3rem;
}

.categories__tbody {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>
