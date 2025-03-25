<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories';
import type { Category } from '~/types/categories';
import type { HistoryActionEvents } from '~/types/common';
import formatList from '~/utils/common';

const categoriesStore = useCategoriesStore();

const actions = (action: HistoryActionEvents) => {};

const categories = ref<Category[]>([])

const toggleSubCategories = (categoryId: string) => {
    const categoryIndex = categories.value.findIndex((item) => String(item.id) === categoryId)

    if(categoryIndex !== -1){
        categories.value[categoryIndex].hasOpenedSubCategories = !categories.value[categoryIndex].hasOpenedSubCategories
    }
};

onMounted(() => {
    categoriesStore.fetchCategories().finally(() => {
        categories.value = categoriesStore.categories.map((category) => ({
        ...category,
        hasOpenedSubCategories: false,
    }))
    })
});
</script>

<template>
    <main class="container">
        <Header @action="actions" :count="categories?.length" />

        <section class="categories__list">
            <div class="categories__tbody">
                <ul
                    class="categories__row"
                    v-for="(category, index) in categories"
                    :key="category.id"
                >
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
                        <span class="categories__row-head">Sub categories</span>
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
                            @click="toggleSubCategories(String(category.id))"
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
                        <CommonButton variant="dark-purple" size="sm" square>
                            <LucideEllipsis :size="16" />
                        </CommonButton>
                    </li>

                    <!-- Subcategories -->
                    <Transition name="slide-fade">
                        <ul v-if="category.hasOpenedSubCategories" class="subcategories__list">
                            <li v-for="subCategory in category.sub_categories" :key="subCategory.id" class="subcategories__item">
                                {{ subCategory.name }}
                            </li>
                        </ul>
                    </Transition>

                    <!-- Sample -->
                    <!-- <li class="categories__row-item">
                        <span class="categories__row-head">Order</span>    
                        <span class="categories__row-label">{{ category.order }}</span>
                    </li> -->
                </ul>
            </div>
        </section>
    </main>
</template>

<style lang="css" scoped>
.subcategories__list {
    margin-top: 10px;
    padding-left: 20px;
    border-left: 2px solid var(--color-secondary);
}

.subcategories__item {
    padding: 5px 0;
    font-size: 14px;
    color: var(--color-gray-300);
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
    grid-template-columns: 40px 200px 100px 1fr 40px 72px;
    gap: 16px;
    background-color: var(--color-gray-900);
    padding: 12px;
    border-radius: 6px;
    align-items: center;
    transition: background 0.2s ease-in-out;
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
