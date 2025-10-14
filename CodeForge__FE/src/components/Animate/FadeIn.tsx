// import { motion, useAnimation, Variants } from "framer-motion";
// import { useEffect } from "react";

// interface WaveTextProps {
//   text: string;
//   waveDuration?: number;
//   entranceDelay?: number;
// }

// export function WaveText({
//   text,
//   waveDuration = 1.1,
//   entranceDelay = 0,
// }: WaveTextProps) {
//   const controls = useAnimation();

//   // Container chỉ cần static
//   const container: Variants = {
//     hidden: {},
//     visible: {
//       transition: { staggerChildren: 0.03, delayChildren: entranceDelay },
//     },
//   };

//   // Variants cho từng ký tự
//   const char: Variants = {
//     hidden: { opacity: 0, y: 12 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.35, ease: "easeOut" },
//     },
//   };

//   useEffect(() => {
//     (async () => {
//       // Entrance effect
//       await controls.start("visible");

//       // Wave effect loop
//       controls.start((i: number) => ({
//         y: [0, -8, 0],
//         transition: {
//           delay: i * 0.06,
//           duration: waveDuration,
//           repeat: Infinity,
//           repeatType: "mirror",
//           ease: "easeInOut",
//         },
//       }));
//     })();

//     return () => {
//       controls.stop();
//     };
//   }, [controls, waveDuration]);

//   return (
//     <motion.span
//       variants={container}
//       initial="hidden"
//       animate={controls}
//       style={{ display: "inline-block", whiteSpace: "nowrap" }}
//     >
//       {Array.from(text).map((ch, idx) => (
//         <motion.span
//           key={idx}
//           custom={idx}
//           variants={char}
//           style={{ display: "inline-block", padding: "0 0.03em" }}
//         >
//           {ch === " " ? "\u00A0" : ch}
//         </motion.span>
//       ))}
//     </motion.span>
//   );
// }
