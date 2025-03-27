    import { SubCategory } from './../../types/categories';
    import { createClient } from '@supabase/supabase-js';

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    );

    export default defineEventHandler(async (event) => {
        if (event.method !== 'POST') {
            throw createError({
                statusCode: 405,
                message: 'Method Not Allowed',
            });
        }

        const body = await readBody(event);
        const { draggedItem, targetCategoryId, type, targetSubId } = body;

        if (!draggedItem) {
            throw createError({
                statusCode: 400,
                message: 'No dragged item provided',
            });
        }

        if (type === 'category' && draggedItem.type === 'category') {
            // 🟢 Reorder Categories (Main Level)
            const { data: categories, error } = await supabase
                .from('categories')
                .select('*')

            if (error) {
                throw createError({
                    statusCode: 500,
                    message: error.message,
                });
            }

            const fromIndex = categories.findIndex(cat => cat.id === draggedItem.categoryId);
            const toIndex = categories.findIndex(cat => cat.id === targetCategoryId);

            if (fromIndex !== -1 && toIndex !== -1) {
                const [movedCategory] = categories.splice(fromIndex, 1);
                categories.splice(toIndex, 0, movedCategory);

                // Update order values
                categories.forEach((cat, index) => (cat.order = index + 1));

                // 🟢 Save changes
                const { error: updateError } = await supabase
                    .from('categories')
                    .upsert(categories, { onConflict: ['id'] });

                if (updateError) {
                    throw createError({ statusCode: 500, message: updateError.message });
                }
            }
        } else if (type === 'subcategory' && draggedItem.type === 'subcategory') {
            // 🟢 Reorder Subcategories Inside a Category
            const { data: category, error } = await supabase
                .from('categories')
                .select('*')
                .eq('id', draggedItem.categoryId)
                .single();

            if (error || !category) {
                throw createError({ statusCode: 500, message: 'Category not found' });
            }

            let subCategories = Array.isArray(category.sub_categories)
                ? category.sub_categories
                : JSON.parse(category.sub_categories || '[]');


            const fromIndex = subCategories.findIndex((sub: SubCategory) => sub.id === draggedItem.subId);
            const toIndex = subCategories.findIndex((sub: SubCategory) => sub.id === targetSubId);

            if (fromIndex !== -1 && toIndex !== -1) {
                const [movedSubcategory] = subCategories.splice(fromIndex, 1);
                subCategories.splice(toIndex, 0, movedSubcategory);

                // Update order values
                subCategories.forEach((sub: SubCategory, index: number) => (sub.order = index + 1));

                // 🟢 Save updated subcategories
                const { error: updateError } = await supabase
                    .from('categories')
                    .update({ sub_categories: subCategories })
                    .eq('id', draggedItem.categoryId);

                if (updateError) {
                    throw createError({ statusCode: 500, message: updateError.message });
                }
            }
        }

        return { success: true, message: 'Reordered successfully' };
    });
