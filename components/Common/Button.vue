<script setup lang="ts">
import { defineProps } from 'vue';

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'dark-purple';

type ButtonSize = 'sm' | 'md' | 'lg';

defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    square?: boolean;
}>();
</script>

<template>
    <button
        :class="[
            'button',
            `button--${variant || 'primary'}`,
            `button--${size || 'md'}`,
            { 'button--disabled': disabled },
            { 'button--square': square },
        ]"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>

<style scoped>
.button {
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
}

.button--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.button--md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
}

.button--square {
    padding: 0.5rem !important;
}

.button--lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
}

.button--primary {
    background-color: var(--color-purple);
    color: var(--color-text-body);
}

.button--primary:hover {
    background-color: var(--color-dark-purple);
}

.button--dark-purple {
    color: var(--color-purple);
    background-color: var(--color-dark-purple);
}

.button--dark-purple:hover {
    color: var(--color-text-body);
    background-color: var(--color-purple);
}

.button--secondary {
    color: var(--color-text-body);
    background-color: var(--color-gray-500);
}

.button--secondary:hover {
    background-color: var(--color-gray-700);
}

.button--danger {
    background-color: var(--color-dark);
}

.button--danger:hover {
    background-color: var(--color-gray-500);
}

.button--success {
    background-color: var(--color-green);
    color: var(--color-dark);
}

.button--success:hover {
    background-color: var(--color-gray-700);
    color: var(--color-text-body);
}

.button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
