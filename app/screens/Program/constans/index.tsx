// Types
export interface Category {
    id: number;
    name: string;
}

export interface Program {
    id: number;
    categoryId: number;
    title: string;
    duration: string;
    image: string;
    description: string;
    isExclusive: boolean;
    equipment: Equipment[];
}

export interface Equipment {
    id: number;
    name: string;
    icon: string;
}

export interface Instruction {
    id: number;
    programId: number;
    week: number;
    title: string;
    subtitle: string;
    content: InstructionContent[];
}

export interface InstructionContent {
    id: number;
    day: number;
    title: string;
    steps: string[];
}

// Data Categories (Parent)
export const CategoryData: Category[] = [
    { id: 1, name: 'Semua' },
    { id: 2, name: 'Fokus' },
    { id: 3, name: 'Kebugaran' }, 
    { id: 4, name: 'Diet' },
    { id: 5, name: 'Kekuatan' }
];

// Data Programs (Child dari Category, Parent dari Instruction)
export const ProgramData: Program[] = [
    {
        id: 1,
        categoryId: 3, // Kebugaran
        title: "Gain Weight in 21 Days",
        duration: "3 Minggu",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
        description: "Sulit utk menaikan berat badan? Program ini dirancang khusus utk membantumu mencapai berat badan ideal dgn metode yg sehat dan terbukti efektif.",
        isExclusive: false,
        equipment: [
            { id: 1, name: "Timbang badan", icon: "scale-bathroom" },
            { id: 2, name: "Matras olahraga", icon: "yoga" },
            { id: 3, name: "Pakaian olahraga", icon: "tshirt-crew" },
            { id: 4, name: "Sepatu olahraga", icon: "shoe-sneaker" }
        ]
    },
    {
        id: 2,
        categoryId: 4, // Diet
        title: "Diet Sehat 30 Hari",
        duration: "4 Minggu",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        description: "Program diet sehat yg dirancang khusus utk membantumu mencapai berat badan ideal.",
        isExclusive: true,
        equipment: [
            { id: 1, name: "Timbang badan", icon: "scale-bathroom" },
            { id: 2, name: "Food container", icon: "restaurant" },
            { id: 3, name: "Food scale", icon: "calculator" }
        ]
    },
    {
        id: 3,
        categoryId: 2, // Fokus
        title: "Meditasi untuk Fokus",
        duration: "2 Minggu",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
        description: "Program meditasi utk tingkatkan fokus dan produktivitas.",
        isExclusive: true,
        equipment: [
            { id: 1, name: "Matras yoga", icon: "fitness" },
            { id: 2, name: "Bantal meditasi", icon: "bed" }
        ]
    }
];

// Data Instructions (Child dari Program)
export const InstructionData: Instruction[] = [
    {
        id: 1,
        programId: 1, // Gain Weight Program
        week: 1,
        title: "Minggu ke 1",
        subtitle: "Menetapkan strategi yg tepat",
        content: [
            {
                id: 1,
                day: 1,
                title: "Hari 1: Pengenalan Program",
                steps: [
                    "Pengukuran berat badan awal",
                    "Perhitungan kalori harian",
                    "Pengenalan alat-alat"
                ]
            },
            {
                id: 2,
                day: 2,
                title: "Hari 2: Mulai Latihan",
                steps: [
                    "Pemanasan dasar",
                    "Latihan inti",
                    "Pendinginan"
                ]
            }
        ]
    },
    {
        id: 2,
        programId: 1,
        week: 2,
        title: "Minggu ke 2",
        subtitle: "Mengoptimalkan pola makan",
        content: [
            {
                id: 1,
                day: 8,
                title: "Hari 8: Nutrisi",
                steps: [
                    "Pengenalan makronutrien",
                    "Menyusun menu harian",
                    "Tips makan besar"
                ]
            }
        ]
    }
];

// Helper Functions
export const getProgramsByCategory = (categoryId: number): Program[] => {
    if (categoryId === 1) return ProgramData; // Jika Semua
    return ProgramData.filter(program => program.categoryId === categoryId);
};

export const getInstructionsByProgram = (programId: number): Instruction[] => {
    return InstructionData.filter(instruction => instruction.programId === programId);
};

export const getProgramById = (id: number): Program | undefined => {
    return ProgramData.find(program => program.id === id);
};

export const getCategoryById = (id: number): Category | undefined => {
    return CategoryData.find(category => category.id === id);
};