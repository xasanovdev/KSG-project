import { supabase } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // Fetch categories from Supabase
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('order', { ascending: true })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        // Get total count
        const { count } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true });

        return {
            statusCode: 200,
            statusMessage: 'success',
            data: categories.map((category) => ({
                ...category,
                sub_categories:
                    typeof category.sub_categories === 'string'
                        ? JSON.parse(category.sub_categories)
                        : category.sub_categories,
            })),
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: count ? Math.ceil(count / limit) : 0,
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            statusMessage: 'Something went wrong.',
            error: error,
        };
    }
});
