import { useState, useEffect } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { api } from '@/lib/api';
import type { ChildProfile, ProgressLog, ContentItem, ProfilePreferences } from '@/types';
import {
  ArrowLeft,
  User,
  Eye,
  Ear,
  MessageCircle,
  Type,
  Contrast,
  Wind,
  Save,
  LogOut,
  Volume2,
  Plus,
  Star,
  TrendingUp,
  BookOpen,
  Brain,
  Users,
  Clock,
} from 'lucide-react';

export function Dashboard() {
  const { profile, setProfile, setView, speak, preferences, updatePreferences, updateProfile } = useAbility();
  const [allProfiles, setAllProfiles] = useState<ChildProfile[]>([]);
  const [allLogs, setAllLogs] = useState<ProgressLog[]>([]);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'profiles' | 'settings'>('overview');
  const [editingPrefs, setEditingPrefs] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profiles, logs, content] = await Promise.all([
        api.profiles.list(),
        api.progress.list(),
        api.content.list(),
      ]);
      setAllProfiles(profiles);
      setAllLogs(logs);
      setAllContent(content);
    } catch {
      // keep previous state if the backend is unreachable
    }
  };

  const handleSwitchProfile = (p: ChildProfile) => {
    setProfile(p);
  };

  const handleLogout = () => {
    localStorage.removeItem('inclusivekids_profile');
    setProfile(null);
  };

  const totalStars = allLogs.reduce((sum, l) => sum + l.stars, 0);
  const completedCount = allLogs.filter((l) => l.completed).length;

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-b from-purple-50 to-fuchsia-50">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-slate-600 font-bold mb-4 hover:text-slate-800 transition-all focus-ring rounded-xl px-2 py-1"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Parent & Teacher Dashboard</h1>
        <p className="text-slate-600 mb-6">Manage profiles, track progress, and customize settings.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'overview' as const, label: 'Overview', icon: TrendingUp },
            { key: 'profiles' as const, label: 'Profiles', icon: Users },
            { key: 'settings' as const, label: 'Settings', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all focus-ring whitespace-nowrap ${
                  activeTab === tab.key ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-5 text-center shadow-md">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                  <Star className="w-7 h-7 text-amber-500" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{totalStars}</p>
                <p className="text-sm text-slate-500">Total Stars</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-md">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{completedCount}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-md">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{allProfiles.length}</p>
                <p className="text-sm text-slate-500">Profiles</p>
              </div>
            </div>

            {/* Content library stats */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Content Library</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{allContent.filter((c) => c.type === 'story').length}</p>
                    <p className="text-sm text-slate-500">Stories</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
                  <Brain className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{allContent.filter((c) => c.type === 'quiz').length}</p>
                    <p className="text-sm text-slate-500">Quizzes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent activity across profiles */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity (All Profiles)</h2>
              {allLogs.length === 0 ? (
                <p className="text-slate-500 text-center py-6">No activity yet.</p>
              ) : (
                <div className="space-y-2">
                  {allLogs.slice(0, 8).map((log) => {
                    const child = allProfiles.find((p) => p.id === log.child_id);
                    const content = allContent.find((c) => c.id === log.content_id);
                    return (
                      <div key={log.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-700 truncate">
                            {child?.name || 'Unknown'} — {content?.title || 'Activity'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(log.created_at).toLocaleDateString()} · Score: {log.score}%
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s <= log.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profiles tab */}
        {activeTab === 'profiles' && (
          <div className="space-y-4">
            <button
              onClick={() => {
                localStorage.removeItem('inclusivekids_profile');
                setProfile(null);
              }}
              className="w-full py-4 rounded-2xl bg-purple-500 text-white text-lg font-bold hover:bg-purple-600 transition-all focus-ring shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-6 h-6" />
              Add New Child Profile
            </button>

            <div className="space-y-3">
              {allProfiles.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{p.name}</p>
                        <p className="text-sm text-slate-500">Age {p.age}</p>
                      </div>
                    </div>
                    {profile?.id === p.id && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap mb-3">
                    {p.vision_impairment && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Vision Support
                      </span>
                    )}
                    {p.hearing_impairment && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <Ear className="w-3 h-3" /> Hearing Support
                      </span>
                    )}
                    {p.speech_impairment && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> Speech Support
                      </span>
                    )}
                    {!p.vision_impairment && !p.hearing_impairment && !p.speech_impairment && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        No special support needed
                      </span>
                    )}
                  </div>

                  {profile?.id !== p.id && (
                    <button
                      onClick={() => handleSwitchProfile(p)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all focus-ring"
                    >
                      Switch to This Profile
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings tab */}
        {activeTab === 'settings' && profile && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Accessibility Settings</h2>

              {/* Font size */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-slate-700 font-bold mb-3">
                  <Type className="w-5 h-5" />
                  Text Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'medium' as const, label: 'Normal' },
                    { val: 'large' as const, label: 'Large' },
                    { val: 'xlarge' as const, label: 'Extra Large' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => updatePreferences({ fontSize: opt.val })}
                      className={`py-3 rounded-xl font-bold transition-all focus-ring ${
                        preferences.fontSize === opt.val
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* High contrast */}
              <div className="mb-6">
                <button
                  onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all focus-ring ${
                    preferences.highContrast ? 'bg-purple-100' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Contrast className="w-6 h-6 text-slate-600" />
                    <span className="font-bold text-slate-700">High Contrast Mode</span>
                  </span>
                  <div className={`w-12 h-7 rounded-full transition-all relative ${
                    preferences.highContrast ? 'bg-purple-500' : 'bg-slate-300'
                  }`}>
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                      preferences.highContrast ? 'left-6' : 'left-1'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Reduce motion */}
              <div className="mb-6">
                <button
                  onClick={() => updatePreferences({ reduceMotion: !preferences.reduceMotion })}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all focus-ring ${
                    preferences.reduceMotion ? 'bg-purple-100' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Wind className="w-6 h-6 text-slate-600" />
                    <span className="font-bold text-slate-700">Reduce Motion</span>
                  </span>
                  <div className={`w-12 h-7 rounded-full transition-all relative ${
                    preferences.reduceMotion ? 'bg-purple-500' : 'bg-slate-300'
                  }`}>
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                      preferences.reduceMotion ? 'left-6' : 'left-1'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Voice speed */}
              <div>
                <label className="flex items-center gap-2 text-slate-700 font-bold mb-3">
                  <Volume2 className="w-5 h-5" />
                  Voice Speed: {preferences.voiceRate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={preferences.voiceRate}
                  onChange={(e) => updatePreferences({ voiceRate: parseFloat(e.target.value) })}
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-500"
                  aria-label="Voice speed"
                />
                <div className="flex justify-between text-sm text-slate-500 mt-1">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
                <button
                  onClick={() => speak('This is how my voice sounds at the current speed.')}
                  className="mt-3 py-2 px-4 rounded-xl bg-purple-100 text-purple-700 font-bold text-sm hover:bg-purple-200 transition-all focus-ring flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Test Voice
                </button>
              </div>
            </div>

            {/* Profile info */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <User className="w-6 h-6 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Name</p>
                    <p className="font-bold text-slate-700">{profile.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <User className="w-6 h-6 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Age</p>
                    <p className="font-bold text-slate-700">{profile.age} years old</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl bg-red-100 text-red-600 text-lg font-bold hover:bg-red-200 transition-all focus-ring flex items-center justify-center gap-2"
            >
              <LogOut className="w-6 h-6" />
              Switch User / Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
