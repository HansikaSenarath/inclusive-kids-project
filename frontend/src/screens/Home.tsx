import { useAbility } from '@/context/AbilityContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import type { ViewName } from '@/types';
import {
  BookOpen,
  MessageSquare,
  Star,
  Gamepad2,
  Mic,
  Volume2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HomeCard {
  view: ViewName;
  title: string;
  subtitle: string;
  icon: typeof BookOpen;
  gradient: string;
  iconBg: string;
}

const cards: HomeCard[] = [
  {
    view: 'learn',
    title: 'Learn',
    subtitle: 'Stories, quizzes, and games',
    icon: BookOpen,
    gradient: 'from-emerald-400 to-teal-500',
    iconBg: 'bg-white/25',
  },
  {
    view: 'communicate',
    title: 'Talk',
    subtitle: 'Picture boards and messages',
    icon: MessageSquare,
    gradient: 'from-orange-400 to-amber-500',
    iconBg: 'bg-white/25',
  },
  {
    view: 'progress',
    title: 'My Stars',
    subtitle: 'See your progress and rewards',
    icon: Star,
    gradient: 'from-amber-400 to-yellow-500',
    iconBg: 'bg-white/25',
  },
  {
    view: 'learn',
    title: 'Play Games',
    subtitle: 'Fun quizzes and puzzles',
    icon: Gamepad2,
    gradient: 'from-pink-400 to-rose-500',
    iconBg: 'bg-white/25',
  },
];

export function Home() {
  const { profile, setView, speak, abilityMode, stopSpeaking, isSpeaking } = useAbility();

  const handleCardClick = (view: ViewName, title: string) => {
    setView(view);
    if (abilityMode === 'voice' || abilityMode === 'combined') {
      speak(`Opening ${title}`);
    }
  };

  const voiceCommands: Record<string, { view: ViewName; title: string }> = {
    learn: { view: 'learn', title: 'Learn' },
    'go to learn': { view: 'learn', title: 'Learn' },
    talk: { view: 'communicate', title: 'Talk' },
    communicate: { view: 'communicate', title: 'Talk' },
    stars: { view: 'progress', title: 'My Stars' },
    progress: { view: 'progress', title: 'My Stars' },
    games: { view: 'learn', title: 'Play Games' },
    play: { view: 'learn', title: 'Play Games' },
  };

  const handleVoiceResult = (text: string) => {
    const target = voiceCommands[text];
    if (target) {
      handleCardClick(target.view, target.title);
    } else {
      speak('Try saying learn, talk, stars, or games.');
    }
  };

  const { isListening, startListening, stopListening, supported } = useSpeechRecognition(handleVoiceResult);

  const avatarIcons: Record<string, string> = {
    star: 'Star',
    heart: 'Heart',
    smile: 'Smile',
    sun: 'Sun',
    moon: 'Moon',
    palette: 'Palette',
  };

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-b from-sky-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 pt-8 pb-12 rounded-b-[2.5rem] shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/25 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm opacity-90">InclusiveKids Hub</p>
                <h1 className="text-2xl font-bold">Hi, {profile?.name}!</h1>
              </div>
            </div>
            {(abilityMode === 'voice' || abilityMode === 'combined') && supported && (
              <button
                onClick={() => (isListening ? stopListening() : startListening())}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all focus-ring ${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-white/25 hover:bg-white/35'
                }`}
                aria-label={isListening ? 'Stop voice command' : 'Start voice command'}
              >
                <Mic className="w-5 h-5" />
                {isListening ? 'Listening...' : 'Voice'}
              </button>
            )}
          </div>

          <p className="text-lg opacity-95">
            {isSpeaking
              ? 'Speaking... tap stop to quiet me.'
              : isListening
              ? 'I am listening... say a word like Learn or Talk'
              : 'What would you like to do today?'}
          </p>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-white/25 rounded-xl font-bold hover:bg-white/35 transition-all focus-ring"
            >
              <Volume2 className="w-5 h-5" />
              Stop Audio
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <button
                key={i}
                onClick={() => handleCardClick(card.view, card.title)}
                className={`card-interactive focus-ring bg-gradient-to-br ${card.gradient} text-white rounded-3xl p-6 text-left shadow-lg`}
                style={{ animationDelay: `${i * 100}ms` }}
                aria-label={`${card.title}: ${card.subtitle}`}
              >
                <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-1">{card.title}</h2>
                <p className="text-base opacity-90 flex items-center gap-1">
                  {card.subtitle}
                  <ArrowRight className="w-4 h-4" />
                </p>
              </button>
            );
          })}
        </div>

        {/* Mode indicator */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Your accessibility mode</p>
            <p className="text-lg font-bold text-slate-700 capitalize">
              {abilityMode === 'voice' && 'Voice + Audio'}
              {abilityMode === 'visual' && 'Visual + Pictures'}
              {abilityMode === 'caption' && 'Visual + Captions'}
              {abilityMode === 'combined' && 'Multi-sensory'}
            </p>
          </div>
          <div className="bg-blue-100 rounded-xl p-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
