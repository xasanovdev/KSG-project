<script setup lang="ts">
import type { Ref } from 'vue';
import type { Category } from '~/types/categories';

interface Props {
    category?: Category; // Optional for new category creation
}

interface Emits {
    (e: 'save', data: Category): void;
    (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const showEditModal = defineModel() as Ref<boolean>;

const formData = ref<Category>({
    id: props.category?.id ?? Date.now(), 
    name: props.category?.name ?? '',
    order: props.category?.order ?? 1,
    sub_categories: props.category?.sub_categories
        ? [...props.category.sub_categories]
        : [],
    hasOpenedSubCategories: props.category?.hasOpenedSubCategories ?? false,
});

// Function to add a new subcategory
const addSubcategory = () => {
    formData.value.sub_categories.push({
        id: Date.now(),
        name: '',
        order: formData.value.sub_categories.length + 1,
    });
};

// Function to remove a subcategory
const removeSubcategory = (index: number) => {
    formData.value.sub_categories.splice(index, 1);
};

const save = () => {
    emits('save', formData.value);

    formData.value = {}
}

watch(
    () => props.category,
    (v) => {
        if(v) {
            formData.value = v
        } else {
            formData.value = {
                id: Date.now(),
                name: '',
                order: 1,
                sub_categories: [],
                hasOpenedSubCategories: false,
            }
        }
    },
    { deep: true, immediate: true }
);
</script>

<template>
    <CommonModal v-model="showEditModal" title="Edit / Create Category">
        <div class="edit__content">
            <!-- Category Name Input -->
            <CommonInput v-model="formData.name" label="Category Name" />

            <!-- Subcategories Section -->
            <div class="subcategories__section">
                <h4>Subcategories</h4>
                <div
                    v-for="(sub, index) in formData.sub_categories"
                    :key="sub.id"
                    class="subcategories__list"
                >
                    <CommonInput
                        v-model="formData.sub_categories[index].name"
                        class="subcategories__input"
                        :label="`Subcategory ${index + 1}`"
                    />
                    <button
                        class="remove-btn"
                        @click="removeSubcategory(index)"
                    >
                        ✖
                    </button>
                </div>

                <!-- Add Subcategory Button -->
                <CommonButton
                    type="secondary"
                    class="add-subcategory-btn"
                    @click="addSubcategory"
                >
                    + Add Subcategory
                </CommonButton>
            </div>

            <!-- Actions -->
            <div class="edit__actions">
                <CommonButton type="primary" @click.stop="$emit('cancel')">
                    Cancel
                </CommonButton>
                <CommonButton type="success" @click="save">
                    Save
                </CommonButton>
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

.subcategories__list {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.subcategories__input {
    width: 100%;
}

.remove-btn {
    background: transparent;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 18px;
}

.add-subcategory-btn {
    margin-top: 10px;
}

.edit__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 16px;
}
</style>
