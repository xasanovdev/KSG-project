<template>
    <div class="categories-skeleton">
      <div 
        v-for="n in 5" 
        :key="n" 
        class="category-skeleton"
      >
        <div class="category-skeleton-number"></div>
        <div class="category-skeleton-icon"></div>
        <div class="category-skeleton-content">
          <div class="category-skeleton-name"></div>
          <div class="category-skeleton-subcategories"></div>
        </div>
        <div class="category-skeleton-order"></div>
        <div class="category-skeleton-actions">
          <div class="category-skeleton-badge"></div>
          <div class="category-skeleton-check"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // No logic needed for skeleton loader
  </script>
  
  <style scoped>
  .categories-skeleton {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .category-skeleton {
    display: flex;
    background-color: #43305b;
    align-items: center;
    padding: 15px;
    border-radius: 8px;
  }
  
  .category-skeleton-number {
    width: 30px;
    height: 20px;
    background-color: var(--color-purple);
    margin-right: 15px;
    animation: pulse 1.5s infinite;
  }
  
  .category-skeleton-icon {
    width: 20px;
    height: 20px;
    background-color: var(--color-purple);
    margin-right: 15px;
    animation: pulse 1.5s infinite;
  }
  
  .category-skeleton-content {
    flex-grow: 1;
  }
  
  .category-skeleton-name {
    width: 150px;
    height: 16px;
    background-color: #e0e0e0;
    margin-bottom: 8px;
    animation: pulse 1.5s infinite;
  }
  
  .category-skeleton-subcategories {
    width: 200px;
    height: 14px;
    background-color: #e0e0e0;
    animation: pulse 1.5s infinite;
  }
  
  .category-skeleton-order {
    width: 30px;
    height: 16px;
    background-color: #e0e0e0;
    margin-right: 15px;
    animation: pulse 1.5s infinite;
  }
  
  .category-skeleton-actions {
    display: flex;
    align-items: center;
  }
  
  .category-skeleton-badge {
    width: 20px;
    height: 20px;
    background-color: #e0e0e0;
    margin-right: 10px;
    animation: pulse 1.5s infinite;
  }
  
  .category-skeleton-check {
    width: 20px;
    height: 20px;
    background-color: #e0e0e0;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { background-color: var(--color-purple) }
    50% { background-color: var(--color-dark-purple) }
    100% { background-color: var(--color-purple) }
  }
  </style>