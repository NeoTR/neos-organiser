import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import ToDo from "./components/ToDo";
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='todo' element={<ToDo />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
