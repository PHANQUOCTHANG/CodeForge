// utils/motion.js
const prefersReducedMotion = () => {
  typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
export default prefersReducedMotion;
