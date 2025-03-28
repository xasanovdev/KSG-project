<template>
    <main class="container">
        <Header @action="actions" :count="categories?.length" />

        <section class="categories__list">
            <div class="categories__tbody">
                <CommonCardRenderer
                    no-data-text="Categories not found"
                    :loading="categoriesStore.loading"
                    :has-items="categories.length > 0"
                    class="categories__tbody"
                >
                    <template #items>
                        <div
                            v-for="(category, index) in categories"
                            :key="category.id"
                            class="category-container"
                            draggable="true"
                            @dragstart="
                                onDragStart($event, category.id, 'category')
                            "
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
                                        @dragstart.stop="onDragStart"
                                        @drop.stop="onDrop"
                                        @edit="handleEdit"
                                        @remove="handleRemove"
                                    />
                                </section>
                            </Transition>
                        </div>
                    </template>

                    <template #loading>
                        <SkeletonMainWrapper />
                    </template>
                </CommonCardRenderer>
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

        <CommonPagination
            v-if="!categoriesStore.loading"
            :total-pages="categoriesStore.categoriesPaginationData.totalPages"
            :total-items="categoriesStore.categoriesPaginationData.total"
            :current-page="currentPage"
            :pagination-list="paginationList"
            @next-page="nextPage"
            @prev-page="prevPage"
            @change-page="changePage"
        />
    </main>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories';
import type { Category } from '~/types/categories';
import type { HistoryActionEvents } from '~/types/common';

const categoriesStore = useCategoriesStore();

const categories = ref<Category[]>([]);

const currentPage = ref(1);

const paginationList = computed(() =>
    generatePaginationData(
        currentPage.value,
        categoriesStore.categoriesPaginationData.total
    )
);

const showEditModal = ref(false);
const warningDeleteModal = ref(false);

const selectedCategoryId = ref<string | null>(null);
const selectedSubCategoryId = ref<string | null>(null);
const selectedCategory = ref<Category | null>(null);

const changePage = (page: number) => {
    if (!isNaN(page)) {
        currentPage.value = page;

        categoriesStore.fetchCategories(page);
    }
};

const nextPage = () => {
    currentPage.value += 1;

    categoriesStore.fetchCategories(currentPage.value);
};

const prevPage = () => {
    currentPage.value -= 1;

    categoriesStore.fetchCategories(currentPage.value);
};

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

const onDrop = async (
    event: DragEvent,
    targetCategoryId: number,
    type: 'category' | 'subcategory',
    targetSubId?: number
) => {
    event.preventDefault();
    if (!draggedItem.value) return;

    try {
        const response = await $fetch('/api/reorder-categories', {
            method: 'POST',
            body: {
                draggedItem: draggedItem.value,
                targetCategoryId,
                type,
                targetSubId,
            },
        });

        if (response.success) {
            console.log(response.message);
        }
    } catch (error) {
        console.error('Error reordering:', error);
    } finally {
        categoriesStore.fetchCategories(currentPage.value);
    }

    draggedItem.value = null;
};

const handleEdit = (category: Category) => {
    selectedCategory.value = category;
    showEditModal.value = true;
};

const updateCategory = (category: Category) => {
    showEditModal.value = false;
    categoriesStore.updateCategory(category.id, category)
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
    categoriesStore.fetchCategories(currentPage.value);
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

watch(
    () => categoriesStore.categoriesPaginationData,
    () => {
        currentPage.value = categoriesStore.categoriesPaginationData.page;
    },
    { immediate: true, deep: true }
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
    margin: 3rem 0;
}

.categories__tbody {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>
