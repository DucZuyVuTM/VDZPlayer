import { Routes, Route } from 'react-router-dom';
import FacebookPlayer from './pages/FacebookPlayer';
import Header from './widgets/Header';
import Footer from './widgets/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<FacebookPlayer />} />
        </Routes>
      </main>

      <Footer />
    </div>    
  );
}

export default App;
