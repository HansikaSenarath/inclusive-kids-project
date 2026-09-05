import { useState, useEffect } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { api } from '@/lib/api';
import type { ContentItem } from '@/types';
import {
  BookOpen,
  Brain,
  Gamepad2,
  Heart,
  Calculator,
  Rocket,
  Palette,
  Puzzle,
  Lightbulb,
  Volume2,
  ArrowLeft,
  Eye,
  Ear,
  Captions,
} from 'lucide-react';

const iconMap: Record<string, typeof BookOpen> = {
  'book-open': BookOpen,
  calculator: Calculator,
  palette: Palette,
  rocket: Rocket,
  puzzle: Puzzle,
  brain: Brain,
  heart: Heart,
  lightbulb: Lightbulb,
  'game-pad': Gamepad2,
};

const categoryColors: Record<string, string> = {
  literacy: 'from-emerald-400 to-teal-500',
  numeracy: 'from-blue-400 to-indigo-500',
  science: 'from-purple-400 to-violet-500',
  social: 'from-pink-400 to-rose-500',
};

export function Learn() {
  const { profile, speak, setView, abilityMode } = useAbility();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'story' | 'quiz'>('all');
  const [selected, setSelected] = useState<ContentItem | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await api.content.list();
      setItems(data);
      if (abilityMode === 'voice' || abilityMode === 'combined') {
        speak('Here are your learning activities. Tap any card to start.');
      }
    } catch {
      // keep the empty list if the backend is unreachable
    } finally {
      setLoading(false);
    }
  };

  const ageMatch = (item: ContentItem) => {
    if (!profile) return true;
    return profile.age >= item.age_min && profile.age <= item.age_max;
  };

  const filtered = items.filter((i) => {
    if (filter !== 'all' && i.type !== filter) return false;
    return ageMatch(i);
  });

  const handleSelect = (item: ContentItem) => {
    setSelected(item);
    if (abilityMode === 'voice' || abilityMode === 'combined') {
      speak(`${item.title}. ${item.description}`);
    }
  };

  if (selected) {
    if (selected.type === 'story') {
      return <StoryViewer item={selected} onBack={() => setSelected(null)} />;
    }
    return <QuizViewer item={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-b from-emerald-50 to-teal-50">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-slate-600 font-bold mb-4 hover:text-slate-800 transition-all focus-ring rounded-xl px-2 py-1"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Learn & Play</h1>
        <p className="text-slate-600 mb-6">Stories, quizzes, and games made just for you!</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all' as const, label: 'All', icon: null },
            { key: 'story' as const, label: 'Stories', icon: BookOpen },
            { key: 'quiz' as const, label: 'Quizzes', icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all focus-ring ${
                  filter === tab.key ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                <div className="bg-slate-200 rounded-2xl h-14 w-14 mb-4" />
                <div className="bg-slate-200 rounded h-6 w-3/4 mb-2" />
                <div className="bg-slate-200 rounded h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((item, i) => {
              const Icon = iconMap[item.icon] || BookOpen;
              const gradient = categoryColors[item.category] || 'from-slate-400 to-slate-500';
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="card-interactive focus-ring bg-white rounded-3xl p-6 text-left shadow-md animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                  aria-label={`${item.title}: ${item.description}`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">{item.title}</h2>
                  <p className="text-sm text-slate-600 mb-3">{item.description}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      item.type === 'story' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.type === 'story' ? 'Story' : 'Quiz'}
                    </span>
                    <span className="text-xs text-slate-500">Ages {item.age_min}-{item.age_max}</span>

                    {/* Accessibility indicators */}
                    <div className="flex gap-1 ml-auto">
                      {item.has_audio && (
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center" title="Has audio">
                          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                      )}
                      {item.has_captions && (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center" title="Has captions">
                          <Captions className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                      )}
                      {item.has_visual && (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center" title="Has visuals">
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-500">No activities found for your age. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Story Viewer =====
function StoryViewer({ item, onBack }: { item: ContentItem; onBack: () => void }) {
  const { speak, abilityMode, stopSpeaking, isSpeaking, profile } = useAbility();
  const story = item.content as unknown as { pages: { text: string; image: string }[] };
  const [page, setPage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const currentPage = story.pages[page];
  const isLast = page === story.pages.length - 1;

  useEffect(() => {
    if (abilityMode === 'voice' || abilityMode === 'combined' || autoPlay) {
      speak(currentPage.text);
    }
  }, [page, autoPlay]);

  const next = () => {
    if (isLast) {
      logProgress();
      onBack();
      speak('Great job! You finished the story!');
    } else {
      setPage((p) => p + 1);
    }
  };

  const prev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const logProgress = async () => {
    if (!profile) return;
    await api.progress.create({
      child_id: profile.id,
      content_id: item.id,
      completed: true,
      stars: 3,
      score: 100,
    });
  };

  // Emoji art for story images
  const imageEmojis: Record<string, string> = {
    turtle: '🐢', 'turtle-brave': '🐢💪', 'turtle-rabbit': '🐢🐰', 'rabbit-thank': '🐰💛',
    'turtle-smile': '🐢😊', apple: '🍎', sky: '☁️', sun: '☀️', leaves: '🌿', rainbow: '🌈',
    mars: '🔴', jupiter: '🟠', saturn: '🪐', venus: '🌍',
    maya: '👧', dream: '💭', lamp: '💡', village: '🏘️', 'maya-success': '👧🎉',
  };

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => { stopSpeaking(); onBack(); }}
            className="flex items-center gap-2 text-white font-bold hover:text-slate-200 transition-all focus-ring rounded-xl px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition-all"
              >
                Stop
              </button>
            )}
            <button
              onClick={() => speak(currentPage.text)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition-all"
              aria-label="Read this page"
            >
              <Volume2 className="w-4 h-4" />
              Read
            </button>
          </div>
        </div>

        {/* Page indicator */}
        <div className="flex justify-center gap-1.5 mb-4">
          {story.pages.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === page ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>

        {/* Story page */}
        <div
          key={page}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center animate-bounce-in min-h-[400px] flex flex-col items-center justify-center"
        >
          <div className="text-8xl sm:text-9xl mb-6">
            {imageEmojis[currentPage.image] || '📖'}
          </div>
          <p className="text-xl sm:text-2xl text-slate-800 font-medium leading-relaxed max-w-md">
            {currentPage.text}
          </p>

          {abilityMode === 'caption' && (
            <div className="mt-6 bg-slate-900 text-white rounded-xl px-4 py-2 inline-flex items-center gap-2">
              <Captions className="w-5 h-5" />
              <span className="text-sm">Captions: {currentPage.text}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prev}
            disabled={page === 0}
            className={`px-6 py-3 rounded-xl font-bold transition-all focus-ring ${
              page === 0 ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Previous
          </button>

          <span className="text-white font-bold text-sm">
            Page {page + 1} of {story.pages.length}
          </span>

          <button
            onClick={next}
            className="px-6 py-3 rounded-xl font-bold bg-white text-slate-800 hover:bg-slate-100 transition-all focus-ring shadow-lg"
          >
            {isLast ? 'Finish! 🎉' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Quiz Viewer =====
function QuizViewer({ item, onBack }: { item: ContentItem; onBack: () => void }) {
  const { speak, abilityMode, profile } = useAbility();
  const quiz = item.content as unknown as { questions: { question: string; options: string[]; answer: number; emoji: string }[] };
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[currentQ];
  const isLastQ = currentQ === quiz.questions.length - 1;

  useEffect(() => {
    if (abilityMode === 'voice' || abilityMode === 'combined') {
      speak(`${question.question}. Option 1: ${question.options[0]}. Option 2: ${question.options[1]}. Option 3: ${question.options[2]}`);
    }
  }, [currentQ]);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const correct = index === question.answer;
    if (correct) {
      setScore((s) => s + 1);
      speak('Correct! Great job!');
    } else {
      speak(`Not quite. The answer is ${question.options[question.answer]}`);
    }
  };

  const handleNext = async () => {
    if (isLastQ) {
      setFinished(true);
      const stars = score >= quiz.questions.length * 0.8 ? 3 : score >= quiz.questions.length * 0.5 ? 2 : 1;
      if (profile) {
        await api.progress.create({
          child_id: profile.id,
          content_id: item.id,
          completed: true,
          score: score * 100,
          stars,
        });
      }
      speak(`Quiz finished! You got ${score} out of ${quiz.questions.length} correct!`);
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (finished) {
    const stars = score >= quiz.questions.length * 0.8 ? 3 : score >= quiz.questions.length * 0.5 ? 2 : 1;
    return (
      <div className="min-h-screen pb-28 bg-gradient-to-b from-amber-400 to-orange-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full animate-bounce-in">
          <p className="text-6xl mb-4">🎉</p>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Amazing Job!</h2>
          <p className="text-xl text-slate-600 mb-6">
            You got {score} out of {quiz.questions.length} correct!
          </p>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`text-5xl ${s <= stars ? 'animate-star-burst' : 'opacity-30'}`}
                style={{ animationDelay: `${s * 200}ms` }}
              >
                ⭐
              </span>
            ))}
          </div>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-orange-500 text-white text-xl font-bold hover:bg-orange-600 transition-all focus-ring shadow-lg"
          >
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-800 transition-all focus-ring rounded-xl px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <span className="text-sm font-bold text-slate-600">
            Question {currentQ + 1} of {quiz.questions.length} · Score: {score}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-slate-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div key={currentQ} className="bg-white rounded-3xl p-8 shadow-lg animate-bounce-in">
          <div className="text-6xl text-center mb-4">{question.emoji}</div>
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">{question.question}</h2>

          {abilityMode === 'caption' && (
            <div className="bg-slate-900 text-white rounded-xl px-4 py-2 mb-4 flex items-center gap-2">
              <Captions className="w-5 h-5" />
              <span className="text-sm">{question.question}</span>
            </div>
          )}

          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === question.answer;
              let style = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
              if (showResult) {
                if (isCorrect) style = 'bg-emerald-500 text-white';
                else if (isSelected) style = 'bg-red-500 text-white';
                else style = 'bg-slate-100 text-slate-400';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  className={`w-full py-4 px-6 rounded-2xl text-lg font-bold transition-all focus-ring ${style} ${
                    !showResult ? 'hover:scale-102' : ''
                  }`}
                  aria-label={`Option ${i + 1}: ${option}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                    {showResult && isCorrect && <span className="ml-auto">✅</span>}
                    {showResult && isSelected && !isCorrect && <span className="ml-auto">❌</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {showResult && (
            <button
              onClick={handleNext}
              className="w-full mt-6 py-4 rounded-2xl bg-blue-500 text-white text-xl font-bold hover:bg-blue-600 transition-all focus-ring shadow-lg animate-bounce-in"
            >
              {isLastQ ? 'See Results! 🎉' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
