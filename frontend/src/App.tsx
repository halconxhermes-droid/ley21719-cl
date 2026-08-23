import { RolProvider } from "./context/RolContext";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./views/Home";
import LectorModulo from "./views/LectorModulo";
import QuizView from "./views/Quiz";
import ChecklistView from "./views/Checklist";
import GlosarioView from "./views/Glosario";
import TestFinalView from "./views/TestFinal";
import ResultadosView from "./views/Resultados";

function ViewRouter() {
  const { view } = useNavigation();

  switch (view) {
    case "home":
      return <Home />;
    case "lector":
      return <LectorModulo />;
    case "quiz":
      return <QuizView />;
    case "checklist":
      return <ChecklistView />;
    case "glosario":
      return <GlosarioView />;
    case "testfinal":
      return <TestFinalView />;
    case "resultados":
      return <ResultadosView />;
    default:
      return <Home />;
  }
}

export default function App() {
  return (
    <RolProvider>
      <NavigationProvider>
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Header />
        <main id="main-content" role="main" className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
          <ViewRouter />
        </main>
        <Footer />
      </NavigationProvider>
    </RolProvider>
  );
}
