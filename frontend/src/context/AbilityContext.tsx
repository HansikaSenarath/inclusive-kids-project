import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ChildProfile, ViewName, AbilityMode, ProfilePreferences } from '@/types';
import { api } from '@/lib/api';

interface AbilityContextValue {
  profile: ChildProfile | null;
  setProfile: (profile: ChildProfile | null) => void;
  view: ViewName;
  setView: (view: ViewName) => void;
  abilityMode: AbilityMode;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  preferences: ProfilePreferences;
  updatePreferences: (prefs: Partial<ProfilePreferences>) => void;
  updateProfile: (updates: Partial<ChildProfile>) => void;
  loading: boolean;
}

const defaultPreferences: ProfilePreferences = {
  fontSize: 'large',
  highContrast: false,
  reduceMotion: false,
  voiceRate: 0.9,
};

const AbilityContext = createContext<AbilityContextValue | undefined>(undefined);

export function AbilityProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ChildProfile | null>(null);
  const [view, setView] = useState<ViewName>('onboarding');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [preferences, setPreferences] = useState<ProfilePreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('inclusivekids_profile');
    if (saved) {
      try {
        const p = JSON.parse(saved) as ChildProfile;
        setProfileState(p);
        setPreferences(p.preferences || defaultPreferences);
        setView('home');
      } catch {
        // ignore parse error
      }
    }
  }, []);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('inclusivekids_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('high-contrast', 'reduce-motion', 'font-size-large', 'font-size-xlarge');
    if (preferences.highContrast) root.classList.add('high-contrast');
    if (preferences.reduceMotion) root.classList.add('reduce-motion');
    if (preferences.fontSize === 'large') root.classList.add('font-size-large');
    if (preferences.fontSize === 'xlarge') root.classList.add('font-size-xlarge');
  }, [preferences]);

  const setProfile = (p: ChildProfile | null) => {
    setProfileState(p);
    if (p) {
      setPreferences(p.preferences || defaultPreferences);
      setView('home');
    } else {
      setView('onboarding');
    }
  };

  const updatePreferences = (prefs: Partial<ProfilePreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...prefs };
      if (profile) {
        const updated = { ...profile, preferences: next };
        setProfileState(updated);
        localStorage.setItem('inclusivekids_profile', JSON.stringify(updated));
        api.profiles.update(profile.id, { preferences: next }).catch(() => {});
      }
      return next;
    });
  };

  const updateProfile = (updates: Partial<ChildProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfileState(updated);
    localStorage.setItem('inclusivekids_profile', JSON.stringify(updated));
    if (updates.preferences) {
      setPreferences(updates.preferences);
    }
    api.profiles.update(profile.id, updates).catch(() => {});
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = preferences.voiceRate;
    utterance.pitch = 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const abilityMode: AbilityMode = (() => {
    if (!profile) return 'visual';
    const v = profile.vision_impairment;
    const h = profile.hearing_impairment;
    const s = profile.speech_impairment;
    if (v && h) return 'combined';
    if (v) return 'voice';
    if (h) return 'caption';
    if (s) return 'visual';
    return 'visual';
  })();

  return (
    <AbilityContext.Provider
      value={{
        profile,
        setProfile,
        view,
        setView,
        abilityMode,
        speak,
        stopSpeaking,
        isSpeaking,
        preferences,
        updatePreferences,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const ctx = useContext(AbilityContext);
  if (!ctx) throw new Error('useAbility must be used within AbilityProvider');
  return ctx;
}
