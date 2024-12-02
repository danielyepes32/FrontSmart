import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
      <div>
        <Routes>
          {/* Define your routes here */}
          <Route path='/' element={<Login />} />
          <Route path='/admin/*' element={<Admin />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
  );
}

export default App;