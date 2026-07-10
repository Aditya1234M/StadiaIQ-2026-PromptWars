/**
 * @description Root application component managing tab routing and global context provider for Fan Persona.
 */
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { NavigationHub } from './pages/NavigationHub';
import { StadiaCopilot } from './pages/StadiaCopilot';
import { TransitEco } from './pages/TransitEco';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content app-layout" style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'navigate' && <NavigationHub />}
        {activeTab === 'copilot' && <StadiaCopilot setActiveTab={setActiveTab} />}
        {activeTab === 'transit' && <TransitEco />}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
