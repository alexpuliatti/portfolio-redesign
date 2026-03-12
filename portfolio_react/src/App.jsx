import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Photography } from './pages/Photography';
import { Writings } from './pages/Writings';
import { About } from './pages/About';
import { useSmoothScroll } from './hooks/useSmoothScroll';

function App() {
  // Initialize Lenis smooth scroll for the app
  useSmoothScroll();

  const [activeTab, setActiveTab] = useState('Photography');

  return (
    <>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'Photography' && <Photography />}
      {activeTab === 'Writings' && <Writings />}
      {activeTab === 'About' && <About />}
    </>
  );
}

export default App;
