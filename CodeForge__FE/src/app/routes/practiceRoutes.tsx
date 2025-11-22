import { CodingLayout } from "@/layouts";
import { PracticeDetailPage } from "@/pages";

export const practiceRouters = {
  path: "/practice/:slug",
  element: <CodingLayout />,
  children: [{ index: true, element: <PracticeDetailPage /> }],
};
