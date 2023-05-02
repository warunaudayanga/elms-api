export interface QuizAnswer {
    id: string;
    answer: string[];
}

export interface Quiz {
    id: string;
    heading?: string;
    question: string;
    options?: string[];
    multiple?: boolean;
    answer?: string[];
}

export interface QuizAnswerList {
    assessmentId: number;
    answers: QuizAnswer[];
}
