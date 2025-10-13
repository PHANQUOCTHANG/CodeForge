import Hero from "@/components/Hero/Hero";
import "./Home.scss";
import { Features } from "@/components/Feature/Feature";
import { CodeEditor } from "@/components/CodeEditorRun/CodeEditorRun";
import ReasonSection from "@/components/ReasonSection/ReasonSection";
import CourseCarousel from "@/components/CourseCarousel/CourseCarousel";
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
