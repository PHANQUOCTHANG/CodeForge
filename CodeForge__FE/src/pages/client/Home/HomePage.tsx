import Hero from "@/common/components/Hero/Hero";
import { Features } from "@/common/components/Feature/Feature";
import { CodeEditor } from "@/common/components/CodeEditorRun/CodeEditorRun";
import ReasonSection from "@/common/components/ReasonSection/ReasonSection";
import CourseCarousel from "@/common/components/CourseCarousel/CourseCarousel";
const HomePage = () => {
  return (
    <>
      <Hero />
      <ReasonSection />
      <Features />
      <CodeEditor />
      <CourseCarousel />
    </>
  );
};
export default HomePage;
