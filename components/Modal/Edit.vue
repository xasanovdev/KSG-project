<script setup lang="ts">
import type { Ref } from 'vue';
import type { Category, SubCategory } from '~/types/categories';

interface Props {
    category: Category;
}

interface Emits {
    (
        e: 'save',
        data: Category
    ): void;
    (e: 'cancel'): void;
}

const props = defineProps<Props>();

defineEmits<Emits>();

const showEditModal = defineModel() as Ref<boolean>;

const formData = ref<Category>(null);

// Initialize form with provided category data
watchEffect(() => {
    formData.value = props.category
});
</script>

<template>
    <CommonModal v-model="showEditModal" title="Edit Category & Subcategories">
        <div class="edit__content">
            <CommonInput
                v-model="formData.name"
                label="Category Name"
            />

            <div
                v-if="formData.sub_categories.length"
                class="subcategories__section"
            >
                <h4>Edit Subcategories</h4>
                <div
                    v-for="(subName, index) in formData.sub_categories"
                    :key="index"
                    class="subcategories__list"
                >
                    <CommonInput
                        v-model="formData.sub_categories[index].name"
                        :label="`Subcategory ${index + 1}`"
                    />
                </div>
            </div>

            <div class="edit__actions">
                <CommonButton type="primary" @click="$emit('cancel')"
                    >Cancel</CommonButton
                >
                <CommonButton type="success" @click="$emit('save', formData)"
                    >Save</CommonButton
                >
            </div>
        </div>
    </CommonModal>
</template>

<style scoped lang="css">
.edit__content {
    padding: 10px;
}

.subcategories__section {
    margin-top: 20px;
    text-align: left;
}

.edit__actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 16px;
}

.subcategories__list {
    display: flex;
    flex-direction: column;
    gap: 4;
}
</style>
