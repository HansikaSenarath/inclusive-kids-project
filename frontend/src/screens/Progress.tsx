import { useState, useEffect } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { api } from '@/lib/api';
import type { ProgressLog, ContentItem } from '@/types';
import { Star, Trophy, Award, TrendingUp, ArrowLeft, BookOpen, Brain, Volume2 } from 'lucide-react';

export function Progress() {
  const { profile, speak, setView, abilityMode } = useAbility();
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [contentMap, setContentMap] = useState<Record<string, ContentItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [profile]);

  const loadProgress = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const [progressLogs, content] = await Promise.all([
        api.progress.list(profile.id),
        api.content.list(),
      ]);

      setLogs(progressLogs);
      const map: Record<string, ContentItem> = {};
      content.forEach((c) => (map[c.id] = c));
      setContentMap(map);

      if (abilityMode === 'voice' || abilityMode === 'combined') {
        const totalStars = progressLogs.reduce((sum, l) => sum + l.stars, 0);
        speak(`You have earned ${totalStars} stars! Great work!`);
      }
    } finally {
      setLoading(false);
    }
  };

  const totalStars = logs.reduce((sum, l) => sum + l.stars, 0);
  const completedCount = logs.filter((l) => l.completed).length;
  const avgScore = logs.length > 0 ? Math.round(logs.reduce((sum, l) => sum + l.score, 0) / logs.length) : 0;

  const milestones = [
    { stars: 1, label: 'First Star!', emoji: '🌟', reached: totalStars >= 1 },
    { stars: 5, label: 'Getting Started', emoji: '⭐', reached: totalStars >= 5 },
    { stars: 10, label: 'Star Collector', emoji: '🏆', reached: totalStars >= 10 },
    { stars: 20, label: 'Super Star!', emoji: '👑', reached: totalStars >= 20 },
    { stars: 50, label: 'Champion!', emoji: '🎖️', reached: totalStars >= 50 },
  ];

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-b from-amber-50 to-yellow-100">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-slate-600 font-bold mb-4 hover:text-slate-800 transition-all focus-ring rounded-xl px-2 py-1"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Stars & Progress</h1>
        <p className="text-slate-600 mb-6">Look at all the amazing things you've done, {profile?.name}!</p>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-5 text-center shadow-md">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
              <Star className="w-7 h-7 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{totalStars}</p>
            <p className="text-sm text-slate-500">Stars Earned</p>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-md">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{completedCount}</p>
            <p className="text-sm text-slate-500">Completed</p>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-md">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{avgScore}%</p>
            <p className="text-sm text-slate-500">Avg Score</p>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Achievements
          </h2>
          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.stars}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                  m.reached ? 'bg-amber-50' : 'bg-slate-50 opacity-60'
                }`}
              >
                <div className={`text-4xl ${m.reached ? 'animate-bounce-in' : 'grayscale'}`}>{m.emoji}</div>
                <div className="flex-1">
                  <p className={`font-bold ${m.reached ? 'text-slate-800' : 'text-slate-400'}`}>{m.label}</p>
                  <p className="text-sm text-slate-500">Earn {m.stars} stars total</p>
                </div>
                {m.reached && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white">
                    Unlocked!
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activities</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-5xl mb-3">📚</p>
              <p className="text-slate-500">No activities yet. Go to Learn to start your first adventure!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 10).map((log) => {
                const content = contentMap[log.content_id];
                const Icon = content?.type === 'story' ? BookOpen : Brain;
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-700 truncate">{content?.title || 'Activity'}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(log.created_at).toLocaleDateString()} · Score: {log.score}%
                      </p>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${s <= log.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Voice replay button */}
        {(abilityMode === 'voice' || abilityMode === 'combined') && (
          <button
            onClick={() => speak(`You have earned ${totalStars} stars and completed ${completedCount} activities. Keep up the great work!`)}
            className="w-full mt-6 py-4 rounded-2xl bg-amber-500 text-white text-xl font-bold hover:bg-amber-600 transition-all focus-ring shadow-lg flex items-center justify-center gap-3"
          >
            <Volume2 className="w-6 h-6" />
            Hear My Progress
          </button>
        )}
      </div>
    </div>
  );
}
