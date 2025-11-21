import CodingProblemForm from "@/pages/admin/problem/add-problem/AddProblem";
import EditProblem from "@/pages/admin/problem/edit-problem/EditProblem";

export const adminProblemRoutes = [
  {
    path: "admin/problems/create",
    element: <CodingProblemForm></CodingProblemForm>,
  },
  {
    path: "admin/problems/edit/:slug",
    element: <EditProblem></EditProblem>,
  },
];
