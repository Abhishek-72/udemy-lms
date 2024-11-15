import { Button } from "./components/ui/button";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />}></Route>
    </Routes>
  );
}

export default App;
