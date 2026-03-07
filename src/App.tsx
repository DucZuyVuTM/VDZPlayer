import { Routes, Route } from 'react-router-dom';
import FacebookPlayer from './pages/FacebookPlayer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FacebookPlayer />} />
    </Routes>
  );
}

export default App;
