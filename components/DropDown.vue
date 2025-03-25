<!-- components/OptionsDropdown.vue -->
<template>
    <div class="options-dropdown" ref="dropdownContainer">
        <button @click="toggleDropdown" class="options-trigger">
            <slot name="trigger">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </slot>
        </button>

        <Transition name="dropdown">
            <div v-if="isOpen" class="dropdown-menu">
                <button
                    v-for="(action, index) in actions"
                    :key="index"
                    @click="handleAction(action)"
                    class="dropdown-item"
                >
                    <component
                        v-if="action.icon"
                        :is="action.icon"
                        class="dropdown-item-icon"
                    />
                    {{ action.label }}
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Define prop types
interface Action {
    label: string;
    icon?: any;
    handler: () => void;
}

// Props
const props = defineProps<{
    actions: Action[];
}>();

// State
const isOpen = ref(false);
const dropdownContainer = ref<HTMLElement | null>(null);

// Toggle dropdown
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Handle action click
const handleAction = (action: Action) => {
    action.handler();
    isOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
    if (
        dropdownContainer.value &&
        !dropdownContainer.value.contains(event.target as Node)
    ) {
        isOpen.value = false;
    }
};

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.options-dropdown {
    position: relative;
    display: inline-block;
}

.options-trigger {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    transition: color 0.2s ease;
}

.options-trigger:hover {
    color: #4338ca; /* Purple for hover state */
}

.dropdown-menu {
    position: absolute;
    right: 0;
    top: 100%;
    background-color: var(--color-gray-700); /* Dark background */
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-width: 180px;
    z-index: 10;
    padding: 4px;
    margin-top: 0.5rem;
}

.dropdown-item {
    width: 100%;
    text-align: left;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.dropdown-item:hover {
    background-color: var(--color-gray-500);
}

.dropdown-item-icon {
    width: 16px;
    height: 16px;
}

/* Transition effects */
.dropdown-enter-active,
.dropdown-leave-active {
    transition:
        opacity 0.2s,
        transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
