import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import { NavBar } from "./components";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes />
      </div>
    </Router>
  );
}

export default App;
