import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GreenNav from '@/components/home/green/GreenNav';
import GreenHero from '@/components/home/green/GreenHero';
import GreenTrustStrip from '@/components/home/green/GreenTrustStrip';
import GreenHowItWorks from '@/components/home/green/GreenHowItWorks';
import GreenFeatures from '@/components/home/green/GreenFeatures';
import GreenTwoModes from '@/components/home/green/GreenTwoModes';
import GreenPricing from '@/components/home/green/GreenPricing';
import GreenFaq from '@/components/home/green/GreenFaq';
import GreenFooter from '@/components/home/green/GreenFooter';
import { G } from '@/components/home/green/palette';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCTA = () => {
    if (user?.onboarding_completed) {
      navigate(createPageUrl('Dashboard'));
    } else if (user) {
      navigate(createPageUrl('Onboarding'));
    } else {
      base44.auth.redirectToLogin(createPageUrl('Onboarding'));
    }
  };

  const handleLogin = () => {
    if (user?.onboarding_completed) {
      navigate(createPageUrl('Dashboard'));
    } else if (user) {
      navigate(createPageUrl('Onboarding'));
    } else {
      base44.auth.redirectToLogin();
    }
  };

  const ctaLabel = user?.onboarding_completed ? 'Open the App' : 'Start free trial';

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: G.bg }}>
      <GreenNav onCTA={handleCTA} ctaLabel={ctaLabel} onLogin={handleLogin} scrollTo={scrollTo} user={user} />
      <GreenHero onCTA={handleCTA} ctaLabel={ctaLabel} scrollTo={scrollTo} />
      <GreenTrustStrip />
      <GreenHowItWorks />
      <GreenFeatures />
      <GreenTwoModes />
      <GreenPricing onCTA={handleCTA} />
      <GreenFaq />
      <GreenFooter onCTA={handleCTA} scrollTo={scrollTo} ctaLabel={ctaLabel} />
    </div>
  );
}