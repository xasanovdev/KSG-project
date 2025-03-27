import { supabase } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
    if (event.method !== 'POST') {
        throw createError({ statusCode: 405, message: 'Method Not Allowed' });
    }

    const body = await readBody(event);
    const { category } = body;

    if (!category || !category.name) {
        throw createError({ statusCode: 400, message: 'Category name is required' });
    }

    try {
        // Insert new category into Supabase
        const { data, error } = await supabase
            .from('categories')
            .insert([{
                ...category,
                sub_categories: JSON.stringify(category.sub_categories || [])     
            }])
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            message: 'Category added successfully',
            category: data,
        };
    } catch (error: any) {
        throw createError({ statusCode: 500, message: error.message });
    }
});
