<template>
    <section class="pagination__section">
        <p class="pagination__info">
            Showing 10 of
            {{ totalPages }}
        </p>
        <div class="pagination__body">
            <CommonButton
                variant="secondary"
                square
                @click="$emit('prevPage')"
                :disabled="currentPage === 1"
                ><LucideChevronLeft :size="16"
            /></CommonButton>

            <CommonButton
                :variant="page === currentPage ? 'primary' : 'secondary'"
                square
                v-for="page in paginationList"
                :key="page"
                @click="$emit('changePage', Number(page))"
            >
                {{ page }}
            </CommonButton>

            <CommonButton
                variant="secondary"
                square
                @click="$emit('nextPage')"
                :disabled="currentPage === totalPages"
                ><LucideChevronRight :size="16"
            /></CommonButton>
        </div>
    </section>
</template>

<script setup lang="ts">
interface Props {
    totalPages: number;
    currentPage: number;
    paginationList: (string | number)[];
}

interface Emits {
    (e: 'nextPage'): void;
    (e: 'prevPage'): void;
    (e: 'changePage', page: number): void;
}

defineEmits<Emits>();

defineProps<Props>();
</script>

<style scoped lang="css">
.pagination__section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 32px 0;
}

.pagination__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
}

.pagination__body button {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
