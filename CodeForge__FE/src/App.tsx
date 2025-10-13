import ClientRouters from "@/routes/clientRoutes";
import "./App.css";
import AdminRouters from "@/routes/adminRoutes";
import { ThemeProvider } from "@/components/theme/theme-provider";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ClientRouters />
        <AdminRouters />
      </ThemeProvider>
    </>
  );
}

export default App;
