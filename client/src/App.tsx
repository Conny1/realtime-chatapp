import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
