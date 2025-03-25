<script setup lang="ts">
import { watch } from "vue";

const props = defineProps<{ modelValue: boolean; title?: string }>();
const emit = defineEmits(["update:modelValue"]);

const closeModal = () => {
    emit("update:modelValue", false);
};

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            document.addEventListener("keydown", handleKeydown);
        } else {
            document.removeEventListener("keydown", handleKeydown);
        }
    },
);

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") closeModal();
};
</script>

<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div v-if="modelValue" class="modal-overlay" @click="closeModal">
                <div class="modal-container" @click.stop>
                    <button class="modal-close" @click="closeModal">
                        &times;
                    </button>
                    <h2 class="modal-title">{{ title }}</h2>
                    <div class="modal-content">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<style scoped lang="css">
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-container {
    background: var(--color-gray-500);
    padding: 20px;
    width: 90%;
    max-width: 500px;
    border-radius: 8px;
    position: relative;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease-in-out;
}

.modal-title {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
}

.modal-content {
    font-size: 16px;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

@keyframes fadeIn {
    from {
        transform: scale(0.9);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>