export type GurujiProject = { id: string; name: string; course: string; learningMode: string; subject: string }
export type GurujiProfile = { name: string; projects: GurujiProject[]; activeProjectId: string }
export type QuestionType = 'single_choice' | 'multi_select' | 'fill_blank' | 'numeric' | 'true_false'
export type AssessmentQuestion = { id: string; type: QuestionType; prompt: string; mathml?: string | null; mathml_replaces_prompt?: boolean; options: string[] }
export type Assessment = { id: string; title: string; duration_minutes: number; instructions: string; course: string; subject: string; basis_note: string; questions: AssessmentQuestion[] }
export type Result = { score: number; total: number; breakdown: { question_id: string; correct: boolean; explanation: string }[] }

