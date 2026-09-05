import { useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { api } from '@/lib/api';
import type { ChildProfile } from '@/types';
import {
  Eye,
  Ear,
  MessageCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  User,
  Sparkles,
  Star,
  Heart,
  Smile,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';

const avatars = [
  { id: 'star', icon: Star, color: 'text-amber-500' },
  { id: 'heart', icon: Heart, color: 'text-rose-500' },
  { id: 'smile', icon: Smile, color: 'text-yellow-500' },
  { id: 'sun', icon: Sun, color: 'text-orange-500' },
  { id: 'moon', icon: Moon, color: 'text-indigo-500' },
  { id: 'palette', icon: Palette, color: 'text-purple-500' },
];

const abilities = [
  {
    key: 'vision_impairment' as const,
    label: 'Vision Support',
    desc: 'Blind or low vision — needs voice guidance and audio',
    icon: Eye,
    color: 'bg-blue-500',
    iconColor: 'text-white',
  },
  {
    key: 'hearing_impairment' as const,
    label: 'Hearing Support',
    desc: 'Deaf or hard of hearing — needs captions and visual cues',
    icon: Ear,
    color: 'bg-emerald-500',
    iconColor: 'text-white',
  },
  {
    key: 'speech_impairment' as const,
    label: 'Speech Support',
    desc: 'Non-speaking — needs picture boards and visual tools',
    icon: MessageCircle,
    color: 'bg-orange-500',
    iconColor: 'text-white',
  },
];

export function Onboarding() {
  const { setProfile, speak } = useAbility();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [avatar, setAvatar] = useState('star');
  const [selectedAbilities, setSelectedAbilities] = useState<Record<string, boolean>>({
    vision_impairment: false,
    hearing_impairment: false,
    speech_impairment: false,
  });
  const [saving, setSaving] = useState(false);

  const handleAbilityToggle = (key: string) => {
    setSelectedAbilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = async () => {
    setSaving(true);
    let data: ChildProfile | null = null;
    try {
      data = await api.profiles.create({
        name: name || 'Friend',
        age,
        avatar,
        vision_impairment: selectedAbilities.vision_impairment,
        hearing_impairment: selectedAbilities.hearing_impairment,
        speech_impairment: selectedAbilities.speech_impairment,
      });
    } catch {
      data = null;
    }

    if (!data) {
      const profile: ChildProfile = {
        id: crypto.randomUUID(),
        name: name || 'Friend',
        age,
        avatar,
        pin: null,
        vision_impairment: selectedAbilities.vision_impairment,
        hearing_impairment: selectedAbilities.hearing_impairment,
        speech_impairment: selectedAbilities.speech_impairment,
        preferences: {
          fontSize: 'large',
          highContrast: false,
          reduceMotion: false,
          voiceRate: 0.9,
        },
        created_at: new Date().toISOString(),
      };
      setProfile(profile);
      speak(`Welcome ${profile.name}! Let's start learning and having fun!`);
    } else {
      setProfile(data as ChildProfile);
      speak(`Welcome ${data.name}! Let's start learning and having fun!`);
    }
    setSaving(false);
  };

  const canProceed = step === 0 ? name.trim().length > 0 : step === 1 ? true : step === 2 ? true : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-3 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-blue-500' : i < step ? 'w-3 bg-blue-300' : 'w-3 bg-slate-300'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 animate-slide-up">
          {step === 0 && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 rounded-full p-4">
                  <Sparkles className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Welcome to InclusiveKids Hub!</h1>
              <p className="text-lg text-slate-600 mb-8">Let's set up your profile. What is your name?</p>

              <div className="flex justify-center mb-6">
                <div className="bg-slate-100 rounded-full p-4">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name here"
                className="w-full max-w-sm mx-auto block text-center text-2xl py-4 px-6 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all"
                aria-label="Enter your name"
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">How old are you, {name}?</h2>
              <p className="text-lg text-slate-600 mb-8">Pick your age so we find the right activities for you.</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto mb-8">
                {Array.from({ length: 13 }, (_, i) => i + 4).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className={`large-touch rounded-2xl font-bold text-xl transition-all focus-ring ${
                      age === a
                        ? 'bg-blue-500 text-white shadow-lg scale-110'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    aria-label={`Age ${a}`}
                    aria-pressed={age === a}
                  >
                    {a}
                  </button>
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-700 mb-4">Choose your avatar</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {avatars.map((av) => {
                  const Icon = av.icon;
                  return (
                    <button
                      key={av.id}
                      onClick={() => setAvatar(av.id)}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all focus-ring ${
                        avatar === av.id ? 'bg-blue-100 ring-4 ring-blue-400 scale-110' : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                      aria-label={`Avatar ${av.id}`}
                      aria-pressed={avatar === av.id}
                    >
                      <Icon className={`w-8 h-8 ${av.color}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">How can we help you?</h2>
              <p className="text-lg text-slate-600 mb-8">
                Tap any that apply. This changes how the app works just for you.
              </p>

              <div className="space-y-4 max-w-md mx-auto">
                {abilities.map((ability) => {
                  const Icon = ability.icon;
                  const selected = selectedAbilities[ability.key];
                  return (
                    <button
                      key={ability.key}
                      onClick={() => handleAbilityToggle(ability.key)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all focus-ring ${
                        selected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      aria-pressed={selected}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl ${ability.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-7 h-7 ${ability.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-slate-800">{ability.label}</p>
                          <p className="text-sm text-slate-600">{ability.desc}</p>
                        </div>
                        <div
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selected ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
                          }`}
                        >
                          {selected && <Check className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-slate-500 mt-6">
                You can change these anytime in settings. None selected is okay too!
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all focus-ring ${
                step === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {step < 2 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all focus-ring ${
                  canProceed
                    ? 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg hover:shadow-xl transition-all focus-ring disabled:opacity-50"
              >
                {saving ? 'Setting up...' : 'Start Learning!'}
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
