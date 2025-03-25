// Interfaces matching your data structure
export interface SubCategory {
    id: number;
    name: string;
    order: number;
}

export interface Category {
    id: number;
    name: string;
    order: number;
    hasOpenedSubCategories?: boolean;
    sub_categories: SubCategory[];
}

export interface UserAction {
    type: 'create' | 'update' | 'delete';
    timestamp: number;
    details: any;
}
