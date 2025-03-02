// Program types based on backend schema
export interface Program {
  id: number;
  title: string;
  weeklyDuration: number;
  description: string;
  requirements: string[];
  categoryId: number;
  imgUrl: string;
  isExclusive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Instruction type based on backend schema
export interface Instruction {
  id: number;
  programId: number;
  dayNumber: number;
  weekNumber: number;
  title: string;
  description: string;
  steps: string;
  tips: string;
  orderIndex: number;
  isCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Category type
export interface Category {
  id: number;
  name: string;
}

// Equipment type (for frontend display)
export interface Equipment {
  id: number;
  name: string;
  icon: string;
  bgColor: string;
}

// Default categories
export const CategoryData: Category[] = [
  { id: 1, name: 'Semua' },
  { id: 2, name: 'Fokus' },
  { id: 3, name: 'Kebugaran' },
  { id: 4, name: 'Diet' },
  { id: 5, name: 'Kekuatan' },
];
