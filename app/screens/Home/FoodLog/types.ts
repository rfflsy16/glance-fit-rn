export interface FoodItem {
    id: number;
    name: string;
    portion: string;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
    category: string;
    mealTime?: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
}

export interface NutritionProps {
    selectedFoods: FoodItem[];
    totalNutrition: {
        calories: number;
        carbs: number;
        fat: number;
        protein: number;
    };
} 