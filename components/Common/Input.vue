<script setup lang="ts">
import type { Ref } from 'vue';

interface Props {
    modelValue: string;
    label?: string;
    placeholder?: string;
    type?: string;
}

interface Emits {
    (e: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const inputValue: Ref<string> = ref(props.modelValue);

watch(inputValue, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>

<template>
    <div class="input-wrapper">
        <label v-if="label" class="input-label">{{ label }}</label>
        <input
            :type="type || 'text'"
            v-model="inputValue"
            :placeholder="placeholder"
            class="common-input"
        />
    </div>
</template>

<style scoped lang="css">
.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
}

.input-label {
    font-size: 14px;
    font-weight: 500;
    padding: 1rem 0;
}

.common-input {
    width: 100%;
    padding: 8px;
    color: var(--color-text-body);
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.2s;
    background-color: var(--color-gray-500);
}

.common-input:focus {
    border-color: #353739;
    outline: none;
}
</style>
