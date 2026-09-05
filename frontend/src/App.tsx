import { AbilityProvider, useAbility } from '@/context/AbilityContext';
import { Onboarding } from '@/screens/Onboarding';
import { Home } from '@/screens/Home';
import { Learn } from '@/screens/Learn';
import { Communicate } from '@/screens/Communicate';
import { Progress } from '@/screens/Progress';
import { Dashboard } from '@/screens/Dashboard';
import { NavBar } from '@/components/NavBar';

function AppContent() {
  const { view, profile } = useAbility();

  if (!profile || view === 'onboarding') {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen">
      {view === 'home' && <Home />}
      {view === 'learn' && <Learn />}
      {view === 'communicate' && <Communicate />}
      {view === 'progress' && <Progress />}
      {view === 'dashboard' && <Dashboard />}
      <NavBar />
    </div>
  );
}

function App() {
  return (
    <AbilityProvider>
      <AppContent />
    </AbilityProvider>
  );
}

export default App;
