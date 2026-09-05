import { useAbility } from '@/context/AbilityContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import type { ViewName } from '@/types';
import {
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Mic,
  Home,
  Volume2,
  Square,
} from 'lucide-react';

interface NavItem {
  view: ViewName;
  label: string;
  icon: typeof BookOpen;
  color: string;
  bgColor: string;
}

const navItems: NavItem[] = [
  { view: 'home', label: 'Home', icon: Home, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { view: 'learn', label: 'Learn', icon: BookOpen, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  { view: 'communicate', label: 'Talk', icon: MessageSquare, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { view: 'progress', label: 'Stars', icon: BarChart3, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  { view: 'dashboard', label: 'Dashboard', icon: Settings, color: 'text-purple-600', bgColor: 'bg-purple-100' },
];

export function NavBar() {
  const { view, setView, abilityMode, speak, isSpeaking, stopSpeaking } = useAbility();

  const voiceCommands: Record<string, ViewName> = {
    home: 'home',
    'go home': 'home',
    learn: 'learn',
    'go to learn': 'learn',
    'learning': 'learn',
    talk: 'communicate',
    communicate: 'communicate',
    'go to talk': 'communicate',
    stars: 'progress',
    progress: 'progress',
    dashboard: 'dashboard',
    settings: 'dashboard',
  };

  const handleVoiceResult = (text: string) => {
    const target = voiceCommands[text];
    if (target) {
      setView(target);
      speak(`Going to ${navItems.find((n) => n.view === target)?.label}`);
    } else {
      speak('Sorry, I did not understand. Try saying home, learn, talk, or stars.');
    }
  };

  const { isListening, startListening, stopListening, supported } = useSpeechRecognition(handleVoiceResult);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-lg z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-3xl mx-auto px-2 py-2 flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.view;
          return (
            <button
              key={item.view}
              onClick={() => {
                setView(item.view);
                if (!abilityMode.includes('caption')) {
                  speak(item.label);
                }
              }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all focus-ring ${
                active ? `${item.bgColor} scale-110` : 'hover:bg-slate-100'
              }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`w-6 h-6 ${active ? item.color : 'text-slate-500'}`} />
              <span className={`text-xs font-bold ${active ? item.color : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {(abilityMode === 'voice' || abilityMode === 'combined') && supported && (
          <button
            onClick={handleMicClick}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all focus-ring ${
              isListening ? 'bg-red-100 scale-110' : 'hover:bg-slate-100'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start voice command'}
          >
            <div className={`relative ${isListening ? 'animate-pulse-ring rounded-full' : ''}`}>
              <Mic className={`w-6 h-6 ${isListening ? 'text-red-500' : 'text-slate-500'}`} />
            </div>
            <span className={`text-xs font-bold ${isListening ? 'text-red-500' : 'text-slate-500'}`}>
              {isListening ? 'Listening' : 'Voice'}
            </span>
          </button>
        )}

        {(abilityMode === 'voice' || abilityMode === 'combined') && (
          <button
            onClick={() => (isSpeaking ? stopSpeaking() : speak('Audio is ready. Tap any button to hear it.'))}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all focus-ring hover:bg-slate-100`}
            aria-label={isSpeaking ? 'Stop speaking' : 'Test audio'}
          >
            {isSpeaking ? (
              <Square className="w-6 h-6 text-red-500" />
            ) : (
              <Volume2 className="w-6 h-6 text-slate-500" />
            )}
            <span className={`text-xs font-bold ${isSpeaking ? 'text-red-500' : 'text-slate-500'}`}>
              {isSpeaking ? 'Stop' : 'Audio'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
