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
    sample: `// Ví dụ: In ra Hello World
function greet(name) {
  return "Xin chào, " + name + "!";
}

console.log(greet("CodeForge"));`,
  },
  {
    label: "Python",
    value: "python",
    sample: `# Ví dụ: In ra Hello World
def greet(name):
    return f"Xin chào, {name}!"

print(greet("CodeForge"))`,
  },
  {
    label: "C++",
    value: "cpp",
    sample: `#include <iostream>
using namespace std;

int main() {
    cout << "Xin chào, CodeForge!" << endl;
    return 0;
}`,
  },
  {
    label: "Java",
    value: "java",
    sample: `class Main {
  public static void main(String[] args) {
    System.out.println("Xin chào, CodeForge!");
  }
}`,
  },
  {
    label: "C#",
    value: "csharp",
    sample: `using System;
class Program {
  static void Main() {
    Console.WriteLine("Xin chào, CodeForge!");
  }
}`,
  },
  {
    label: "Go",
    value: "go",
    sample: `package main
import "fmt"

func main() {
  fmt.Println("Xin chào, CodeForge!")
}`,
  },
  {
    label: "PHP",
    value: "php",
    sample: `<?php
echo "Xin chào, CodeForge!";
?>`,
  },
  {
    label: "Rust",
    value: "rust",
    sample: `fn main() {
    println!("Xin chào, CodeForge!");
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

  const handleRunCode = () => {
    setOutput(`Đang chạy ${language}...\nXin chào, CodeForge!`);
    if (code.includes("Xin chào")) setIsCorrect(true);
  };

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
            Thử Trình Biên Tập Mã Tương Tác
          </motion.h2>

          <motion.p
            className="code-editor__subtitle"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            Hãy luyện tập viết mã với phản hồi trực tiếp. Chọn ngôn ngữ, chỉnh
            sửa mã và chạy ngay bên dưới!
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
              Hãy chạy chương trình Hello World
            </h3>

            <span className="code-editor__badge">Dễ</span>

            <div className="code-editor__instructions">
              <h4>Yêu cầu:</h4>
              <p>
                Quan sát đoạn mã và nhấn nút chạy để xem kết quả. Kết quả cần
                hiển thị <code>"Xin chào, CodeForge!"</code>.
              </p>
            </div>

            <div className="code-editor__example">
              <h4>Ví dụ:</h4>
              <pre>{`Input: greet("CodeForge") 
Output: "Xin chào, CodeForge!"`}</pre>
            </div>

            <div className="code-editor__hints">
              <h4>Gợi ý:</h4>
              <ul>
                <li>• Quan sát cấu trúc mã của từng ngôn ngữ</li>
                <li>• Nắm cách chương trình chạy và in kết quả</li>
              </ul>
            </div>

            {isCorrect && (
              <div className="code-editor__success">
                <CheckCircle className="code-editor__success-icon" />
                <span>Tuyệt vời! Bạn đã hoàn thành thử thách!</span>
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
                <RotateCcw className="btn__icon" /> Làm mới
              </CustomButton>

              <CustomButton
                className="btn btn--primary"
                onClick={handleRunCode}
              >
                <Play className="btn__icon" /> Chạy mã
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
                Giao diện
              </CustomButton>
            </div>

            <div className="code-editor__tabs">
              <CodeXml />
              <span>Mã nguồn</span>
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
              <h4>Kết quả:</h4>

              {output ? (
                <pre className="code-editor__output--success">{output}</pre>
              ) : (
                <div className="code-editor__output--placeholder">
                  Nhấn "Chạy mã" để xem kết quả
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
