<template>
    <main class="container">
        <Header @action="actions" :count="categories?.length" />

        <section class="categories__list">
            <div class="categories__tbody">
                <div
                    class="category-container"
                    v-for="(category, index) in categories"
                    :key="category.id"
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
                    <ul
                        class="categories__row"
                        :class="{
                            dragged: draggedItem?.categoryId === category.id,
                        }"
                    >
                        <li class="categories__row-item drag-handle">
                            <LucideGripVertical
                                :size="24"
                                draggable="true"
                                @dragstart="
                                    onDragStart($event, index, 'category')
                                "
                            />
                        </li>

                        <li class="categories__row-item">
                            <span class="categories__row-head">&#8470;</span>
                            <span class="categories__row-label">{{
                                index + 1
                            }}</span>
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
                            <span class="categories__row-label">{{
                                category.order
                            }}</span>
                        </li>
                        <li class="categories__row-item">
                            <span class="categories__row-head"
                                >Sub categories</span
                            >
                            <span class="categories__row-label">{{
                                formatList(category.sub_categories)
                            }}</span>
                        </li>
                        <li class="categories__row-item">
                            <span class="categories__row-count">{{
                                category.sub_categories?.length
                            }}</span>
                        </li>

                        <li class="categories__row-item actions">
                            <CommonButton
                                @click="
                                    toggleSubCategories(String(category.id))
                                "
                                variant="primary"
                                size="sm"
                                square
                            >
                                <LucideChevronDown
                                    :class="{
                                        'rotate-180':
                                            category.hasOpenedSubCategories,
                                    }"
                                    :size="16"
                                />
                            </CommonButton>

                            <DropDown
                                :actions="[
                                    {
                                        label: 'Edit',
                                        icon: LucideEdit,
                                        handler: () => handleEdit(),
                                    },
                                    {
                                        label: 'Remove',
                                        icon: LucideTrash,
                                        handler: () => handleRemove(),
                                    },
                                ]"
                            >
                                <CommonButton
                                    variant="dark-purple"
                                    size="sm"
                                    square
                                >
                                    <LucideEllipsis :size="16" />
                                </CommonButton>
                            </DropDown>
                        </li>
                    </ul>

                    <!-- Subcategories -->
                    <Transition name="slide-fade">
                        <section
                            v-if="category.hasOpenedSubCategories"
                            class="subcategories__list"
                        >
                            <ul
                                class="subcategories__row"
                                v-for="(
                                    sub_category, sub_index
                                ) in category.sub_categories"
                                :key="sub_category.id"
                                draggable="true"
                                @dragstart.stop="
                                    onDragStart(
                                        $event,
                                        category.id,
                                        'subcategory',
                                        sub_category.id
                                    )
                                "
                                @dragover.prevent
                                @drop="
                                    onDrop(
                                        $event,
                                        category.id,
                                        'subcategory',
                                        sub_category.id
                                    )
                                "
                            >
                                <li class="categories__row-item drag-handle">
                                    <LucideGripVertical
                                        :size="24"
                                        draggable="true"
                                        @dragstart.stop="
                                            onDragStart(
                                                $event,
                                                category.id,
                                                'subcategory',
                                                sub_category.id
                                            )
                                        "
                                    />
                                </li>
                                <li class="categories__row-item">
                                    <span class="categories__row-head"
                                        >&#8470;</span
                                    >
                                    <span class="categories__row-label"
                                        >{{ index + 1 }}.
                                        {{ sub_index + 1 }}</span
                                    >
                                </li>
                                <li class="categories__row-item">
                                    <span class="categories__row-head"
                                        >Name</span
                                    >
                                    <span class="categories__row-label">
                                        <LucideFile />
                                        {{ sub_category.name }}
                                    </span>
                                </li>
                                <li class="categories__row-item">
                                    <span class="categories__row-head"
                                        >Order</span
                                    >
                                    <span class="categories__row-label">{{
                                        sub_category.order
                                    }}</span>
                                </li>
                                <li class="categories__row-item actions">
                                    <CommonButton
                                        variant="dark-purple"
                                        size="sm"
                                        square
                                    >
                                        <LucideEllipsis :size="16" />
                                    </CommonButton>
                                </li>
                            </ul>
                        </section>
                    </Transition>
                </div>
            </div>
        </section>


        <CommonWarningModal
            v-model="warningDeleteModal"
            title="Are you sure?"
            subtitle="Do you really want to delete?"
            @confirm="console.log('Confirm')"
            @cancel="warningDeleteModal = false"
        />
    </main>
</template>

<script setup lang="ts">
import { LucideEdit, LucideTrash } from '#components';
import { useCategoriesStore } from '~/store/categories';
import type { Category } from '~/types/categories';
import type { HistoryActionEvents } from '~/types/common';
import formatList from '~/utils/common';

const categoriesStore = useCategoriesStore();
const categories = ref<Category[]>([]);

const warningDeleteModal = ref(false)

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

// Drag state
const draggedItem = ref<{
    categoryId: number;
    type: 'category' | 'subcategory';
    subId?: number;
} | null>(null);

// Drag event handlers
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

            // Recalculate the order for all categories
            categories.value.forEach((cat, index) => {
                cat.order = index + 1;
            });
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

                // Recalculate the order for all subcategories in this category
                category.sub_categories.forEach((sub, index) => {
                    sub.order = index + 1;
                });
            }
        }
    }

    categoriesStore.reorderCategories(categories.value);

    draggedItem.value = null;
};

const handleEdit = () => {
};

const handleRemove = () => {
    warningDeleteModal.value = true;
};

onMounted(() => {
    categoriesStore.fetchCategories().finally(() => {
        categories.value = categoriesStore.categories.map((category) => ({
            ...category,
            hasOpenedSubCategories: false,
        }));
    });
});
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
