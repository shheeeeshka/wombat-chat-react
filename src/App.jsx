import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/Router/AppRouter';
import { ChatContextProvider } from "./context/ChatContext";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <ChatContextProvider
        user={user}
      >
        <AppRouter />
      </ChatContextProvider>
    </BrowserRouter>
  );
}

export default App;
