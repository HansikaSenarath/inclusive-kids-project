import { useState, useEffect } from 'react';
import { useAbility } from '@/context/AbilityContext';
import type { AACSymbol } from '@/types';
import {
  Trash2,
  Volume2,
  X,
  Delete,
} from 'lucide-react';

const defaultSymbols: AACSymbol[] = [
  { id: '1', label: 'I want', emoji: '🙋', category: 'actions' },
  { id: '2', label: 'Yes', emoji: '✅', category: 'responses' },
  { id: '3', label: 'No', emoji: '❌', category: 'responses' },
  { id: '4', label: 'Please', emoji: '🙏', category: 'social' },
  { id: '5', label: 'Thank you', emoji: '💛', category: 'social' },
  { id: '6', label: 'Hello', emoji: '👋', category: 'social' },
  { id: '7', label: 'Goodbye', emoji: '👋', category: 'social' },
  { id: '8', label: 'Happy', emoji: '😊', category: 'feelings' },
  { id: '9', label: 'Sad', emoji: '😢', category: 'feelings' },
  { id: '10', label: 'Hungry', emoji: '🍎', category: 'feelings' },
  { id: '11', label: 'Thirsty', emoji: '🥤', category: 'feelings' },
  { id: '12', label: 'Tired', emoji: '😴', category: 'feelings' },
  { id: '13', label: 'Water', emoji: '💧', category: 'food' },
  { id: '14', label: 'Food', emoji: '🍽️', category: 'food' },
  { id: '15', label: 'Bathroom', emoji: '🚽', category: 'needs' },
  { id: '16', label: 'Help', emoji: '🆘', category: 'needs' },
  { id: '17', label: 'More', emoji: '➕', category: 'actions' },
  { id: '18', label: 'Stop', emoji: '✋', category: 'actions' },
  { id: '19', label: 'Go', emoji: '🏃', category: 'actions' },
  { id: '20', label: 'Play', emoji: '🎮', category: 'actions' },
  { id: '21', label: 'Read', emoji: '📖', category: 'actions' },
  { id: '22', label: 'Sleep', emoji: '🛏️', category: 'actions' },
  { id: '23', label: 'Mom', emoji: '👩', category: 'people' },
  { id: '24', label: 'Dad', emoji: '👨', category: 'people' },
  { id: '25', label: 'Friend', emoji: '🧑‍🤝‍🧑', category: 'people' },
  { id: '26', label: 'Teacher', emoji: '👩‍🏫', category: 'people' },
  { id: '27', label: 'Doctor', emoji: '👨‍⚕️', category: 'people' },
  { id: '28', label: 'Dog', emoji: '🐶', category: 'animals' },
  { id: '29', label: 'Cat', emoji: '🐱', category: 'animals' },
  { id: '30', label: 'Bird', emoji: '🐦', category: 'animals' },
  { id: '31', label: 'Fish', emoji: '🐟', category: 'animals' },
  { id: '32', label: 'School', emoji: '🏫', category: 'places' },
  { id: '33', label: 'Home', emoji: '🏠', category: 'places' },
  { id: '34', label: 'Park', emoji: '🌳', category: 'places' },
  { id: '35', label: 'Doctor office', emoji: '🏥', category: 'places' },
  { id: '36', label: 'Book', emoji: '📕', category: 'objects' },
  { id: '37', label: 'Ball', emoji: '⚽', category: 'objects' },
  { id: '38', label: 'Phone', emoji: '📱', category: 'objects' },
  { id: '39', label: 'Music', emoji: '🎵', category: 'objects' },
  { id: '40', label: 'I love you', emoji: '❤️', category: 'social' },
];

const categories = ['all', 'actions', 'responses', 'social', 'feelings', 'food', 'needs', 'people', 'animals', 'places', 'objects'];

const categoryLabels: Record<string, string> = {
  all: 'All',
  actions: 'Actions',
  responses: 'Yes / No',
  social: 'Social',
  feelings: 'Feelings',
  food: 'Food & Drink',
  needs: 'Needs',
  people: 'People',
  animals: 'Animals',
  places: 'Places',
  objects: 'Objects',
};

export function Communicate() {
  const { speak, profile, abilityMode } = useAbility();
  const [sentence, setSentence] = useState<AACSymbol[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [symbols, setSymbols] = useState<AACSymbol[]>(defaultSymbols);

  useEffect(() => {
    if (profile?.vision_impairment) {
      speak('Welcome to the talk page. Tap a picture to build a sentence. Then tap speak to hear it.');
    }
  }, []);

  const filteredSymbols = activeCategory === 'all' ? symbols : symbols.filter((s) => s.category === activeCategory);

  const addToSentence = (symbol: AACSymbol) => {
    setSentence((prev) => [...prev, symbol]);
    speak(symbol.label);
  };

  const removeFromSentence = (index: number) => {
    setSentence((prev) => prev.filter((_, i) => i !== index));
  };

  const clearSentence = () => {
    setSentence([]);
  };

  const backspace = () => {
    setSentence((prev) => prev.slice(0, -1));
  };

  const speakSentence = () => {
    const text = sentence.map((s) => s.label).join(' ');
    if (text) speak(text);
  };

  return (
    <div className={`min-h-screen pb-28 ${abilityMode === 'caption' ? 'bg-slate-900' : 'bg-orange-50'}`}>
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">Talk Board</h1>

        {/* Sentence strip */}
        <div className={`rounded-3xl p-4 mb-4 shadow-lg ${abilityMode === 'caption' ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-sm font-bold ${abilityMode === 'caption' ? 'text-slate-400' : 'text-slate-500'}`}>
              Your sentence:
            </p>
            <div className="flex gap-2">
              <button
                onClick={backspace}
                disabled={sentence.length === 0}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all focus-ring disabled:opacity-30"
                aria-label="Remove last word"
              >
                <Delete className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={clearSentence}
                disabled={sentence.length === 0}
                className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition-all focus-ring disabled:opacity-30"
                aria-label="Clear sentence"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>

          <div className={`min-h-[80px] rounded-2xl p-3 flex flex-wrap gap-2 items-center ${
            abilityMode === 'caption' ? 'bg-slate-700' : 'bg-slate-50'
          }`}>
            {sentence.length === 0 ? (
              <p className={`text-lg ${abilityMode === 'caption' ? 'text-slate-500' : 'text-slate-400'}`}>
                Tap pictures below to build a sentence...
              </p>
            ) : (
              sentence.map((symbol, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl animate-bounce-in cursor-pointer ${
                    abilityMode === 'caption' ? 'bg-orange-500 text-white' : 'bg-orange-100'
                  }`}
                  onClick={() => removeFromSentence(i)}
                >
                  <span className="text-2xl">{symbol.emoji}</span>
                  <span className={`font-bold ${abilityMode === 'caption' ? 'text-white' : 'text-slate-700'}`}>
                    {symbol.label}
                  </span>
                  <X className="w-4 h-4 opacity-50" />
                </div>
              ))
            )}
          </div>

          {/* Speak button */}
          <button
            onClick={speakSentence}
            disabled={sentence.length === 0}
            className="w-full mt-3 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xl font-bold shadow-lg hover:shadow-xl transition-all focus-ring disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-3"
            aria-label="Speak sentence"
          >
            <Volume2 className="w-7 h-7" />
            Speak!
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all focus-ring ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
              aria-pressed={activeCategory === cat}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Symbol grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {filteredSymbols.map((symbol) => (
            <button
              key={symbol.id}
              onClick={() => addToSentence(symbol)}
              className="card-interactive focus-ring bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md"
              aria-label={symbol.label}
            >
              <span className="text-4xl sm:text-5xl">{symbol.emoji}</span>
              <span className="text-sm font-bold text-slate-700 text-center">{symbol.label}</span>
            </button>
          ))}
        </div>

        {/* Quick phrases for vision-impaired */}
        {abilityMode === 'voice' || abilityMode === 'combined' ? (
          <div className="mt-6 bg-blue-50 rounded-2xl p-4">
            <p className="text-sm font-bold text-blue-700 mb-3">Quick say:</p>
            <div className="grid grid-cols-2 gap-2">
              {['I need help', 'I am hungry', 'I want water', 'I need bathroom', 'I love you', 'I am happy'].map(
                (phrase) => (
                  <button
                    key={phrase}
                    onClick={() => speak(phrase)}
                    className="py-3 px-4 rounded-xl bg-blue-500 text-white font-bold text-base hover:bg-blue-600 transition-all focus-ring flex items-center justify-center gap-2"
                  >
                    <Volume2 className="w-5 h-5" />
                    {phrase}
                  </button>
                )
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
