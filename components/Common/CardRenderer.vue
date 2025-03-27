<template>
    <Transition name="fade" mode="out-in">
        <div :key="loading" class="flex flex-col gap-5">
            <!-- Loading State -->
            <template v-if="loading">
                <slot name="loading" />
            </template>

            <!-- Items State -->
            <template v-else-if="hasItems">
                <slot name="items" />
            </template>

            <!-- No Data State -->
            <template v-else>
                <slot name="no-data">
                    <div class="text-center text-gray-500">
                        {{ noDataText }}
                    </div>
                </slot>
            </template>
        </div>
    </Transition>
</template>

<script setup lang="ts">
interface Props {
    loading: boolean;
    hasItems: boolean;
    noDataText: string;
}

defineProps<Props>();
</script>
