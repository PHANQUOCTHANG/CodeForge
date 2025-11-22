

export interface ProblemTestCase {
  input: Variable[];
  expectedOutput: string;
  explain: string;
  isHidden: boolean;
}

export interface Problem {
  problemId : string ;
  title: string;
  slug: string;
  difficulty: "Dễ" | "Trung Bình" | "Khó";
  status: "NOT_STARTED" | "ATTEMPTED" | "SOLVED";
  description: string;
  tags: string;
  functionName: string;
  parameters: string;
  returnType: string;
  notes: string;
  constraints: string;
  timeLimit: number;
  memoryLimit: number;
  lessonId: string | null;
}

export interface Variable {
  name: string;
  type: string;
  value: string;
}

export interface TestCase {
  testCaseId : string ;
  input: Variable[];
  expectedOutput: string;
  explain: string;
  isHidden: boolean;
}

export interface Lesson {
  id: string;
  name: string;
}

export interface DifficultyOption {
  value: "Dễ" | "Trung Bình" | "Khó";
  label: string;
  color: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

export interface Notification {
  message: string;
  type: "success" | "error";
}

export interface Errors {
  [key: string]: string;
}