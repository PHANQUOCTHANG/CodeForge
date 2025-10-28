import { lazy } from "react";
export const PracticePage = lazy(() => import("./practice-page/PracticePage"));
export const PracticeDetailPage = lazy(
  () => import("./practice-detail-page/DetailPractice")
);
