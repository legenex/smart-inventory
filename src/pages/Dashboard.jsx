import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  PenLine, ChevronRight, Trash2, LogOut, ChevronDown, Settings as SettingsIcon,
  Zap, Heart, BookOpen, Sparkles, ArrowRight, Flame,
  Camera, Smile, Activity, Calendar
} from 'lucide-react';
import InventoryDateDialog from '@/components/inventory/InventoryDateDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format, isToday, differenceInDays, parseISO } from 'date-fns';
import MoodCheckIn from '@/components/home/MoodCheckIn';
import ReadingsDialog from '@/components/readings/ReadingsDialog';
import ProgressRing from '@/components/home/ProgressRing';
import Sparkline from '@/components/home/Sparkline';
import Heatmap from '@/components/home/Heatmap';
import InventoryCard from '@/components/home/InventoryCard';
import { getCopy, getCurrentMilestone, getNextMilestone, isRecovery } from '@/lib/mode';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const isYes = (val) => val === true || val === 'yes';
const isNo = (val) => val === false || val === 'no';

function CountUp({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!target || target <= 0) { setCount(0); return; }
    if (prefersReduced) { setCount(target); return; }
    let startTime = null;
    let rafId;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, prefersReduced]);

  return <span className="tabular-nums">{count.toLocaleString()}</span>;
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [showReadings, setShowReadings] = useState(false);
  const [showInventoryDialog, setShowInventoryDialog] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showReflectionDialog, setShowReflectionDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, [location]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      if (!userData.recovery_status) {
        navigate(createPageUrl('Onboarding'));
        return;
      }
      setUser(userData);
    } catch (err) {
      navigate(createPageUrl('Onboarding'));
    }
  };

  useEffect(() => {
    const interval = setInterval(loadUser, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user && user.mood_check_enabled !== false) {
      const today = new Date().toISOString().split('T')[0];
      if (user.last_mood_check !== today) {
        setTimeout(() => setShowMoodCheckIn(true), 1500);
      }
    }
  }, [user]);

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ['inventoryEntries'],
    queryFn: () => base44.entities.InventoryEntry.list('-date', 50),
    enabled: !!user
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.list('-date', 5),
    enabled: !!user
  });

  const { data: dailyReflection } = useQuery({
    queryKey: ['dailyReflection', user?.recovery_status],
    queryFn: async () => {
      const mode = user.recovery_status;
      const todayKey = format(new Date(), 'MM-dd');
      let reflections = await base44.entities.DailyReflection.filter({
        day_key: todayKey,
        is_published: true
      });
      reflections = reflections.filter(r => r.mode === mode || r.mode === 'both');
      if (reflections.length === 0) {
        reflections = await base44.entities.DailyReflection.filter({ is_published: true });
        reflections = reflections.filter(r => r.mode === mode || r.mode === 'both');
      }
      return reflections[0] || null;
    },
    enabled: !!user
  });

  const [draftExists, setDraftExists] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem('inventory_draft');
    setDraftExists(!!draft);
  }, [location]);

  const handleDeleteDraft = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem('inventory_draft');
    setDraftExists(false);
  };

  const handleDeleteEntry = (deletedId) => {
    refetch();
  };

  const calculateStreak = () => {
    if (!entries.length) return 0;
    let streak = 0;
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else if (streak === 0 && differenceInDays(today, entryDate) === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const copy = getCopy(user?.recovery_status);
  const recovery = isRecovery(user?.recovery_status);
  const todayEntry = entries.find(e => isToday(parseISO(e.date)));
  const streak = calculateStreak();

  const daysSober = useMemo(() => {
    if (!user?.sober_date) return null;
    return Math.floor((new Date() - new Date(user.sober_date)) / (1000 * 60 * 60 * 24));
  }, [user?.sober_date]);

  const milestoneContext = useMemo(() => {
    if (!daysSober) return null;
    const current = getCurrentMilestone(daysSober);
    const next = getNextMilestone(daysSober);
    if (current && next) {
      const progress = Math.round(((daysSober - current.days) / (next.days - current.days)) * 100);
      return `${current.label} · ${progress}% there`;
    }
    if (current) return current.label;
    return null;
  }, [daysSober]);

  const ringProgress = useMemo(() => {
    if (!daysSober) return 0;
    const current = getCurrentMilestone(daysSober);
    const next = getNextMilestone(daysSober);
    if (current && next) {
      return (daysSober - current.days) / (next.days - current.days);
    }
    return 0.1;
  }, [daysSober]);

  const sparklineData = useMemo(() => {
    const today = new Date();
    const mood = [];
    const energy = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);
      if (entry) {
        let score = 3;
        const r = entry.responses || {};
        if (isYes(r.resentful?.value)) score--;
        if (isYes(r.fearful?.value)) score--;
        if (isYes(r.dishonest?.value)) score--;
        if (isYes(r.do_well?.value)) score++;
        if (isNo(r.unkind?.value)) score++;
        if (r.gratitude?.value?.length > 0) score++;
        mood.push(Math.max(0, Math.min(5, score)));
        const count = Object.keys(r).filter(key => {
          const v = r[key]?.value;
          return v && (Array.isArray(v) ? v.length > 0 : true);
        }).length;
        energy.push(Math.min(count / 5, 1) * 5);
      } else {
        mood.push(0);
        energy.push(0);
      }
    }
    return { mood, energy };
  }, [entries]);

  const moodTrend = useMemo(() => {
    const recent = sparklineData.mood.filter(v => v > 0);
    if (recent.length < 2) return '—';
    const last = recent[recent.length - 1];
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    if (last > avg + 0.3) return 'Better';
    if (last < avg - 0.3) return 'Lower';
    return 'Steady';
  }, [sparklineData]);

  const energyTrend = useMemo(() => {
    const recent = sparklineData.energy.filter(v => v > 0);
    if (recent.length < 2) return '—';
    const last = recent[recent.length - 1];
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    if (last > avg + 0.3) return 'Deeper';
    if (last < avg - 0.3) return 'Lighter';
    return 'Steady';
  }, [sparklineData]);

  const insightHeadline = useMemo(() => {
    if (entries.length === 0) return 'Complete your first inventory to unlock insights';
    if (entries.length < 3) return `Keep going — ${3 - entries.length} more to unlock patterns`;
    const recent = entries.slice(0, 10);
    const resentment = recent.filter(e => isYes(e.responses?.resentful?.value)).length;
    if (resentment >= 3) return `Resentment appeared in ${resentment} of your last ${recent.length} entries`;
    const fear = recent.filter(e => isYes(e.responses?.fearful?.value)).length;
    if (fear >= 3) return `Fear showed up in ${fear} of your last ${recent.length} entries`;
    return `You've completed ${entries.length} reflections total`;
  }, [entries]);

  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cardProps = (delay = 0) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: prefersReduced ? 0 : delay },
    whileTap: { scale: prefersReduced ? 1 : 0.97 }
  });

  const hour = new Date().getHours();
  const isEvening = hour >= 17;
  const ctaText = recovery
    ? (isEvening ? "Take tonight's inventory" : "Take today's inventory")
    : (isEvening ? 'Start evening review' : 'Start daily reflection');
  const questionCount = recovery ? '10 questions' : '7 questions';
  const ctaMinutes = recovery ? '6' : '4';

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'var(--soft)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  const firstName = toTitleCase(user.display_name || user.full_name)?.split(' ')[0] || 'Friend';

  return (
    <div>
      {/* Greeting + Profile */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
            {getTimeBasedGreeting()}, <span className="font-display italic">{firstName}</span>
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {format(new Date(), 'EEEE, MMMM d')} · {copy.dashboardGreeting}
          </p>
        </div>

        {/* Desktop profile dropdown */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 rounded-2xl transition-shadow min-h-[44px]"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
                <Avatar className="w-9 h-9 rounded-xl">
                  <AvatarImage src={user.profile_picture} alt={user.display_name || user.full_name} />
                  <AvatarFallback className="text-xs font-medium rounded-xl"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}>
                    {firstName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--muted)' }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate(createPageUrl('Settings'))}>
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => base44.auth.logout()} className="text-red-600 focus:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile profile button */}
        <button
          onClick={() => setShowProfileSheet(true)}
          className="md:hidden flex items-center gap-2 px-2 py-1.5 rounded-2xl min-h-[44px] min-w-[44px]"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <Avatar className="w-8 h-8 rounded-xl">
            <AvatarImage src={user.profile_picture} alt={user.display_name || user.full_name} />
            <AvatarFallback className="text-xs font-medium rounded-xl"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}>
              {firstName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* HERO: Progress Ring */}
        <motion.div {...cardProps(0.05)}
          className="rounded-[22px] p-6 flex items-center gap-4"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          {daysSober !== null ? (
            <>
              <ProgressRing progress={ringProgress} size={130} strokeWidth={7}>
                <div className="text-center">
                  <div className="text-3xl font-bold font-display" style={{ color: 'var(--ink)' }}>
                    <CountUp target={daysSober} />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'var(--muted)' }}>
                    {copy.heroLabel}
                  </div>
                </div>
              </ProgressRing>
              <div className="flex-1">
                {milestoneContext && (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
                    style={{ backgroundColor: 'var(--soft)', color: 'var(--accent)' }}
                  >
                    {milestoneContext}
                  </span>
                )}
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {copy.dashboardGreeting}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 text-center py-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'var(--soft)' }}
              >
                <Calendar className="w-7 h-7" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>
                Set your start date
              </p>
              <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                Track your progress day by day
              </p>
              <Button
                onClick={() => navigate(createPageUrl('Settings'))}
                size="sm"
                variant="outline"
                className="rounded-xl min-h-[36px]"
              >
                Set date
              </Button>
            </div>
          )}
        </motion.div>

        {/* Primary CTA */}
        <motion.div {...cardProps(0.1)}
          onClick={() => {
            if (todayEntry) {
              navigate(createPageUrl(`HistoryDetail?id=${todayEntry.id}`));
            } else {
              setShowInventoryDialog(true);
            }
          }}
          className="rounded-[22px] p-6 cursor-pointer flex flex-col justify-between min-h-[140px]"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
        >
          <div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
              <PenLine className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold">{ctaText}</h2>
            <p className="text-sm opacity-80 mt-0.5">{questionCount} · about {ctaMinutes} min</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium mt-3">
            {todayEntry ? 'View today\'s entry' : 'Get started'}
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Mood card */}
        <motion.div {...cardProps(0.15)}
          className="rounded-[22px] p-5 flex items-center justify-between"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--soft)' }}>
              <Smile className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Mood</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{moodTrend}</p>
            </div>
          </div>
          <Sparkline data={sparklineData.mood} color="var(--accent)" width={70} height={28} />
        </motion.div>

        {/* Energy card */}
        <motion.div {...cardProps(0.2)}
          className="rounded-[22px] p-5 flex items-center justify-between"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--soft)' }}>
              <Activity className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Energy</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{energyTrend}</p>
            </div>
          </div>
          <Sparkline data={sparklineData.energy} color="var(--accent)" width={70} height={28} />
        </motion.div>

        {/* Consistency Heatmap */}
        <motion.div {...cardProps(0.25)}
          className="rounded-[22px] p-5 md:col-span-2"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--soft)' }}>
                <Flame className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Consistency</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Last 4 weeks</p>
              </div>
            </div>
          </div>
          <Heatmap entries={entries} streak={streak} />
        </motion.div>
      </div>

      {/* Toolkit */}
      <motion.div {...cardProps(0.3)}>
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>
          {copy.toolkit}
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <motion.button {...cardProps(0.32)}
            onClick={() => navigate(createPageUrl('SpotCheck'))}
            className="rounded-[20px] p-4 flex flex-col items-center text-center"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-2"
              style={{ backgroundColor: 'var(--soft)' }}>
              <Zap className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>Spot Check</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>2-min reset</p>
          </motion.button>
          <motion.button {...cardProps(0.34)}
            onClick={() => navigate(createPageUrl('GratitudeAffirmations'))}
            className="rounded-[20px] p-4 flex flex-col items-center text-center"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-2"
              style={{ backgroundColor: 'var(--soft)' }}>
              <Heart className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>Gratitude</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>Name three</p>
          </motion.button>
          <motion.button {...cardProps(0.36)}
            onClick={() => navigate(createPageUrl('History'))}
            className="rounded-[20px] p-4 flex flex-col items-center text-center"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-2"
              style={{ backgroundColor: 'var(--soft)' }}>
              <Camera className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>Journal Scan</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>Photo to insight</p>
          </motion.button>
        </div>
      </motion.div>

      {/* Today's Reflection + Insight Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Today's Reflection */}
        <motion.div {...cardProps(0.4)}
          onClick={() => dailyReflection ? setShowReflectionDialog(true) : setShowReadings(true)}
          className="rounded-[22px] p-5 cursor-pointer"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Today's Reflection
            </p>
          </div>
          {dailyReflection ? (
            <>
              <h4 className="font-display text-lg font-medium mb-1" style={{ color: 'var(--ink)' }}>
                {dailyReflection.title}
              </h4>
              <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--muted)' }}>
                {dailyReflection.body}
              </p>
            </>
          ) : (
            <>
              <h4 className="font-display text-lg font-medium mb-1" style={{ color: 'var(--ink)' }}>
                Daily readings
              </h4>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Tap to explore today's reflections
              </p>
            </>
          )}
        </motion.div>

        {/* Insight Preview */}
        <motion.div {...cardProps(0.45)}
          onClick={() => navigate(createPageUrl('History'))}
          className="rounded-[22px] p-5 cursor-pointer"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Insight
            </p>
          </div>
          <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--ink)' }}>
            {insightHeadline}
          </p>
          <div className="flex items-center gap-1 text-xs font-medium mt-3" style={{ color: 'var(--accent)' }}>
            View all <ChevronRight className="w-3 h-3" />
          </div>
        </motion.div>
      </div>

      {/* Saved Inventories */}
      <motion.div {...cardProps(0.5)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>Saved Inventories</h3>
          <Link to={createPageUrl('History')}
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ backgroundColor: 'var(--soft)', color: 'var(--accent)' }}>
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-[20px] p-5 animate-pulse" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl" style={{ backgroundColor: 'var(--soft)' }} />
                  <div className="flex-1">
                    <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: 'var(--soft)' }} />
                    <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--soft)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-[20px] p-8 text-center" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
            <p style={{ color: 'var(--muted)' }}>No reflections yet. Start your first inventory!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {draftExists && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <Link to={createPageUrl('Inventory')}
                  className="block rounded-[20px] p-5 transition-all"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '2px dashed var(--accent)'
                  }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: 'var(--soft)' }}>
                        <PenLine className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold" style={{ color: 'var(--ink)' }}>{format(new Date(), 'EEEE, MMMM d')}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: 'var(--soft)', color: 'var(--accent)' }}>
                            Draft
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>Continue your inventory</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleDeleteDraft}
                        className="p-2 rounded-xl transition-colors">
                        <Trash2 className="w-5 h-5" style={{ color: 'var(--muted)' }} />
                      </button>
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--muted)' }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
            {entries.slice(0, 5).map((entry, index) => (
              <InventoryCard key={entry.id} entry={entry} index={index} onDelete={handleDeleteEntry} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Journaling History */}
      {journalEntries.length > 0 && (
        <motion.div {...cardProps(0.55)} className="mt-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)' }}>Journaling History</h3>
          <div className="space-y-3">
            {journalEntries.map((journal, index) => (
              <motion.div
                key={journal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <Link to={createPageUrl(`HistoryDetail?id=${journal.inventory_id}`)}
                  className="block rounded-[20px] p-5 transition-all"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: 'var(--soft)' }}>
                        <PenLine className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: 'var(--ink)' }}>
                          {format(new Date(journal.date), 'EEEE, MMMM d')}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>
                          {journal.emotional_analysis?.overall_mood || 'Journal entry'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: 'var(--muted)' }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mobile Profile Sheet */}
      <Sheet open={showProfileSheet} onOpenChange={setShowProfileSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl" style={{ backgroundColor: 'var(--surface)' }}>
          <SheetHeader>
            <SheetTitle style={{ color: 'var(--ink)' }}>Profile</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            <Avatar className="w-16 h-16 rounded-2xl">
              <AvatarImage src={user.profile_picture} alt={user.display_name || user.full_name} />
              <AvatarFallback className="text-lg font-medium rounded-2xl"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}>
                {firstName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold text-lg" style={{ color: 'var(--ink)' }}>
              {toTitleCase(user.display_name || user.full_name)}
            </p>
            {daysSober !== null && (
              <p className="text-sm flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                <Flame className="w-3 h-3" /> {daysSober} {copy.heroLabel}
              </p>
            )}
            <div className="w-full space-y-2 mt-2">
              <Button
                onClick={() => { setShowProfileSheet(false); navigate(createPageUrl('Settings')); }}
                variant="outline"
                className="w-full rounded-xl min-h-[48px] justify-start"
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={() => base44.auth.logout()}
                variant="outline"
                className="w-full rounded-xl min-h-[48px] justify-start text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Reflection Dialog */}
      <Dialog open={showReflectionDialog} onOpenChange={setShowReflectionDialog}>
        <DialogContent className="sm:max-w-lg rounded-3xl" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl" style={{ color: 'var(--ink)' }}>
              {dailyReflection?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {dailyReflection?.body && (
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--ink)' }}>
                {dailyReflection.body}
              </p>
            )}
            {dailyReflection?.prompt && (
              <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--soft)' }}>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>Reflection prompt</p>
                <p className="text-sm" style={{ color: 'var(--ink)' }}>{dailyReflection.prompt}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Existing dialogs */}
      <MoodCheckIn open={showMoodCheckIn} onClose={() => setShowMoodCheckIn(false)} />
      <ReadingsDialog open={showReadings} onClose={() => setShowReadings(false)} />
      <InventoryDateDialog open={showInventoryDialog} onClose={() => setShowInventoryDialog(false)} />
    </div>
  );
}