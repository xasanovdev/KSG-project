<script setup lang="ts">
import type { Ref } from "vue";

interface Props {
    title: string;
    subtitle: string;
}

interface Emits {
    (e: "confirm"): void;
    (e: "cancel"): void;
}

defineProps<Props>();

defineEmits<Emits>();

const showWarningModal = defineModel() as Ref<boolean>;
</script>

<template>
    <CommonModal v-model="showWarningModal" title="">
        <div class="warning-content">
            <h3 class="warning-title">{{ title }}</h3>
            <p class="warning-message">{{ subtitle }}</p>
            <div class="warning-actions">
                <CommonButton type="primary" @click="$emit('cancel')">Cancel</CommonButton>
                <CommonButton type="danger" @click="$emit('confirm')"
                    >Confirm</CommonButton
                >
            </div>
        </div>
    </CommonModal>
</template>

<style scoped lang="css">
.warning-content {
    text-align: center;
    padding: 10px;
}

.warning-message {
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 1.5;
}

.warning-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
}
</style>