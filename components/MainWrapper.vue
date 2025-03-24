<script setup lang="ts">
import type { HistoryActionEvents } from '~/types/common';


const actions = (action: HistoryActionEvents) => {
    
}

</script>

<template>
    <main class="container">
        <Header @action="actions"/>
    </main>
</template>

<style lang="css" scoped>

</style>