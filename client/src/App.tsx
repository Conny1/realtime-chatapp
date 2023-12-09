import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <Chat />,
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
