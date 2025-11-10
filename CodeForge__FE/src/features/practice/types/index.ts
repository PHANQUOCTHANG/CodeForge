export interface TestCase {
  name : string , 
  testCaseId: string;
  problemId: string;
  input: string | null;
  expectedOutput: string | null;
  explain: string | null;
  isHidden: boolean;
  isDeleted: boolean;
}

export interface TestResult extends TestCase {
  testCaseId : string ,
  name : string ,
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded" | "Compilation Error" | "Skipped" | string;
  actualOutput: string;  
  passed: boolean;            // Đúng/Sai (so sánh expected vs actual)
  executionTime?: number;     // Thời gian thực thi (ms)
  memoryUsage?: number;       // Bộ nhớ sử dụng (MB)
  errorMessage?: string;      // Nếu có lỗi runtime / compile
}

export type Language = "javascript" | "python" | "cpp";

export const TYPE_MAPPING: Record<string, string> = {
  int: "number",
  long: "number",
  float: "number",
  double: "number",
  bool: "boolean",
  boolean: "boolean",
  char: "string",
  string: "string",
  "int[]": "number[]",
  "long[]": "number[]",
  "vector<int>": "number[]",
  "vector<string>": "string[]",
  "string[]": "string[]",
  "List[int]": "number[]",
  "List[str]": "string[]",
};


export interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  problemTitle: string;
  passedTests: number;
  totalTests: number;
  runtime?: string;
  memory?: string;
  status? : string ;
  message? : string ;
}


export interface SubmitResult {
  testCasePass : number , 
  totalTestCase : number ,
  submit : boolean , 
  status : string ,
  message : string , 
  time : number ,
  memory : number ,
  resultFail : object ,
}