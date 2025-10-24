import { useState } from "react";
import { Play, CheckCircle, CodeXml, Sun, Moon, RotateCcw } from "lucide-react";
import "./CodeEditorRun.scss";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import CustomButton from "@/common/components/Ui/Button/CustomButton";

// ===============================
// DỮ LIỆU CỨNG (Ngôn ngữ + Code mẫu)
// ===============================
const languages = [
  {
    label: "JavaScript",
    value: "javascript",
    sample: `// Example: Print Hello World
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("CodeForge"));`,
  },
  {
    label: "Python",
    value: "python",
    sample: `# Example: Print Hello World
def greet(name):
    return f"Hello, {name}!"

print(greet("CodeForge"))`,
  },
  {
    label: "C++",
    value: "cpp",
    sample: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, CodeForge!" << endl;
    return 0;
}`,
  },
  {
    label: "Java",
    value: "java",
    sample: `class Main {
  public static void main(String[] args) {
    System.out.println("Hello, CodeForge!");
  }
}`,
  },
  {
    label: "C#",
    value: "csharp",
    sample: `using System;
class Program {
  static void Main() {
    Console.WriteLine("Hello, CodeForge!");
  }
}`,
  },
  {
    label: "Go",
    value: "go",
    sample: `package main
import "fmt"

func main() {
  fmt.Println("Hello, CodeForge!")
}`,
  },
  {
    label: "PHP",
    value: "php",
    sample: `<?php
echo "Hello, CodeForge!";
?>`,
  },
  {
    label: "Rust",
    value: "rust",
    sample: `fn main() {
    println!("Hello, CodeForge!");
}`,
  },
];

// ===============================
// COMPONENT CHÍNH
// ===============================
export function CodeEditor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(languages[0].sample);
  const [theme, setTheme] = useState<"vs-dark" | "vs-light">("vs-dark");
  const [output, setOutput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  // Khi đổi ngôn ngữ -> tự load code mẫu
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = languages.find((item) => item.value === e.target.value);
    if (selected) {
      setLanguage(selected.value);
      setCode(selected.sample);
      setOutput("");
      setIsCorrect(false);
    }
  };
  const handleResetCode = () => {
    setOutput("");
    setIsCorrect(false);
  };
  // Run Code (demo hiển thị output cứng)
  const handleRunCode = () => {
    setOutput(`Running ${language}...\nHello, CodeForge!`);
    if (code.includes("Hello")) setIsCorrect(true);
  };

  // Chuyển theme
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "vs-dark" ? "vs-light" : "vs-dark"));
  };

  return (
    <section className="code-editor">
      <div className="code-editor__container">
        {/* Header */}
        <div className="code-editor__header">
          <motion.h2
            className="code-editor__title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            Try Our Interactive Code Editor
          </motion.h2>
          <motion.p
            className="code-editor__subtitle"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            Practice coding with instant feedback. Choose a language, edit code,
            and run it below!
          </motion.p>
        </div>

        {/* Grid */}
        <div className="code-editor__grid">
          {/* Challenge Card */}
          <motion.div
            className="code-editor__card code-editor__challenge"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="code-editor__card-title">
              Try to run Hello world program
            </h3>
            <span className="code-editor__badge">Easy</span>

            <div className="code-editor__instructions">
              <h4>Instructions:</h4>
              <p>
                Look at the code and press the run code button to see the code
                results.
                <code>"Hello, CodeForge!"</code>.
              </p>
            </div>

            <div className="code-editor__example">
              <h4>Example:</h4>
              <pre>{`Input: greet("CodeForge") 
Output: "Hello, CodeForge!"`}</pre>
            </div>

            <div className="code-editor__hints">
              <h4>Hints:</h4>
              <ul>
                <li>• Try to understand the structure of each language </li>
                <li>• Understand how to run code</li>
              </ul>
            </div>

            {isCorrect && (
              <div className="code-editor__success">
                <CheckCircle className="code-editor__success-icon" />
                <span>Great job! Challenge completed!</span>
              </div>
            )}
          </motion.div>

          {/* Editor Card */}
          <motion.div
            className="code-editor__card code-editor__editor"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="code-editor__actions">
              <select
                name="lang-select"
                value={language}
                onChange={handleLanguageChange}
                className="code-editor__select"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <CustomButton
                className="btn btn--primary"
                onClick={handleResetCode}
              >
                <RotateCcw className="btn__icon" /> Reset Code
              </CustomButton>
              <CustomButton
                className="btn btn--primary"
                onClick={handleRunCode}
              >
                <Play className="btn__icon" /> Run Code
              </CustomButton>

              <CustomButton
                className="btn btn--theme"
                onClick={handleToggleTheme}
              >
                {theme === "vs-dark" ? (
                  <Sun className="btn__icon" />
                ) : (
                  <Moon className="btn__icon" />
                )}
                Theme
              </CustomButton>
            </div>

            <div className="code-editor__tabs">
              <CodeXml />
              <span>Code</span>
            </div>

            <div className="code-editor__textarea-wrapper">
              <Editor
                height="250px"
                language={language}
                value={code}
                options={{ readOnly: true }}
                theme={theme}
              />
            </div>

            <div className="code-editor__output">
              <h4>Output:</h4>
              {output ? (
                <pre className="code-editor__output--success">{output}</pre>
              ) : (
                <div className="code-editor__output--placeholder">
                  Click "Run Code" to see output
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
