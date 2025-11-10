import type { CodingProblem } from "@/features/course";
import type { Language } from "../types";
import { convertTypeToJs } from "../utils/index";

// tạo hàm code theo language program và problem .
export const generateFunctionTemplate = (
  problem: CodingProblem | null,
  lang: Language
): string => {
  if (!problem) return "// Problem data is missing";

  const { functionName, parameters, returnType } = problem;

  const paramList =
    parameters
      ?.split(",")
      .map((p) => {
        const parts = p.trim().split(" ");
        const type = parts.slice(0, -1).join(" ");
        const name = parts[parts.length - 1];
        return { type, name };
      })
      .filter((p) => p.name) || [];

  switch (lang) {
    case "cpp":
return `${returnType} ${functionName}(${parameters}) {
}`;

    case "javascript": {
      const jsDocParams = paramList
        .map((p) => ` * @param {${convertTypeToJs(p.type)}} ${p.name}`)
        .join("\n");
      const jsDocReturn = ` * @return {${convertTypeToJs(returnType || "")}}`;
      const paramNames = paramList.map((p) => p.name).join(", ");

      return `/**
${jsDocParams}
${jsDocReturn}
*/
function ${functionName}(${paramNames}) {
\t// Logic của bạn
}`;
    }

    case "python": {
      const paramNames = paramList.map((p) => p.name).join(", ");
      return `def ${functionName}(${paramNames}):
\t# Logic của bạn`;
    }

    default:
      return "// Ngôn ngữ không được hỗ trợ";
  }
};
