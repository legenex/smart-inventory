import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Lock,
  Menu,
  X,
  PenLine
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ContactDialog from '@/components/home/ContactDialog';

export default function Home() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (err) {
      setUser(null);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleCTA = () => {
    if (user) {
      navigate(createPageUrl('Dashboard'));
    } else {
      base44.auth.redirectToLogin(createPageUrl('Dashboard'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#7667E5] to-[#5B9FED] bg-clip-text text-transparent">
              Smart Inventory
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-[#7667E5] font-medium transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-[#7667E5] font-medium transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('what-it-is')} className="text-gray-700 hover:text-[#7667E5] font-medium transition-colors">
                What It Is
              </button>
              <ContactDialog>
                <button className="text-gray-700 hover:text-[#7667E5] font-medium transition-colors">
                  Contact
                </button>
              </ContactDialog>
              
              {user ? (
                <button onClick={() => navigate(createPageUrl('Dashboard'))}>
                  <Avatar className="w-10 h-10 ring-2 ring-[#7667E5]">
                    <AvatarImage src={user.profile_picture} alt={user.display_name || user.full_name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#7667E5] to-[#5B9FED] text-white">
                      {(user.display_name || user.full_name)?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <Avatar className="w-10 h-10 bg-gray-200">
                  <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white">
                    ?
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden pt-4 pb-2 space-y-3"
            >
              <button onClick={() => scrollToSection('home')} className="block w-full text-left text-gray-700 hover:text-[#7667E5] font-medium py-2">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left text-gray-700 hover:text-[#7667E5] font-medium py-2">
                About
              </button>
              <button onClick={() => scrollToSection('what-it-is')} className="block w-full text-left text-gray-700 hover:text-[#7667E5] font-medium py-2">
                What It Is
              </button>
              <ContactDialog>
                <button className="block w-full text-left text-gray-700 hover:text-[#7667E5] font-medium py-2">
                  Contact
                </button>
              </ContactDialog>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-12 md:pt-32 md:pb-20 px-6 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
              >
                <span className="text-sm font-semibold bg-gradient-to-r from-[#7667E5] to-[#5B9FED] bg-clip-text text-transparent">
                  ✨ Your Daily Reflection Companion
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight"
              >
                Know Yourself.{' '}
                <span className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] bg-clip-text text-transparent">
                  Daily.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed"
              >
                Smart Inventory is a private journaling and reflection app that helps you take a daily or nightly inventory, track your personal growth, and gain clarity through AI-powered insights.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Button 
                  onClick={handleCTA}
                  size="lg" 
                  className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] hover:from-[#6557D5] hover:to-[#4A8FDD] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Start Your Free Inventory
                </Button>
                <Button 
                  onClick={handleCTA}
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg rounded-xl border-2 bg-white/50 backdrop-blur-sm hover:bg-white"
                >
                  Create My Account
                </Button>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-gray-600"
              >
                🔒 Trusted by people serious about self-awareness, growth, and emotional clarity.
              </motion.p>
            </motion.div>

            {/* Right Column - Abstract Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative Background Elements */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-[#7667E5] to-[#5B9FED] rounded-full blur-3xl opacity-20"
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-[#5B9FED] to-[#7ECFEC] rounded-full blur-3xl opacity-20"
              />

              {/* Abstract Illustration Container */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                {/* Abstract Shapes Representing Journaling/Reflection */}
                <div className="relative w-full h-[400px] md:h-[500px]">
                  {/* Main Card Shape */}
                  <motion.div
                    animate={{
                      rotateY: [0, 5, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-10 left-10 right-10 h-80 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50"
                  >
                    {/* Simulated Journal Lines */}
                    <div className="space-y-4">
                      <div className="h-3 bg-gradient-to-r from-[#7667E5] to-transparent rounded-full w-3/4" />
                      <div className="h-3 bg-gradient-to-r from-[#5B9FED] to-transparent rounded-full w-full" />
                      <div className="h-3 bg-gradient-to-r from-[#7ECFEC] to-transparent rounded-full w-5/6" />
                      <div className="h-3 bg-gradient-to-r from-[#7667E5] to-transparent rounded-full w-2/3 mt-8" />
                      <div className="h-3 bg-gradient-to-r from-[#5B9FED] to-transparent rounded-full w-4/5" />
                      <div className="h-3 bg-gradient-to-r from-[#7ECFEC] to-transparent rounded-full w-3/4" />
                    </div>

                    {/* Decorative Elements */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-[#7667E5] to-[#5B9FED] rounded-xl opacity-20"
                    />
                  </motion.div>

                  {/* Floating Icon Elements */}
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#7667E5] to-[#5B9FED] rounded-2xl shadow-xl flex items-center justify-center"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, 15, 0],
                      rotate: [0, -10, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute bottom-20 left-0 w-16 h-16 bg-gradient-to-br from-[#5B9FED] to-[#7ECFEC] rounded-2xl shadow-xl flex items-center justify-center"
                  >
                    <PenLine className="w-8 h-8 text-white" />
                  </motion.div>
                </div>

                {/* Floating Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7667E5] to-[#5B9FED] rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">7 Day</p>
                      <p className="text-sm text-gray-500">Streak</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute top-20 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5B9FED] to-[#7ECFEC] rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">Daily</p>
                      <p className="text-sm text-gray-500">Reflection</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Smart Inventory
            </h2>
            <p className="text-2xl text-[#7667E5] font-semibold mb-8">
              Reflection With Structure. Insight With Purpose.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="prose prose-lg max-w-none text-gray-700 space-y-6"
          >
            <p>
              Smart Inventory was created to make self-reflection simple, consistent, and actually useful.
            </p>
            <p>
              Most journaling tools leave you staring at a blank page, unsure where to start or what to write. Smart Inventory replaces that friction with guided daily and nightly inventories that help you check in honestly, notice patterns, and grow with intention.
            </p>
            <p>
              By combining structured prompts with AI-generated insights, Smart Inventory helps you turn your private reflections into meaningful awareness over time, without overthinking or overwhelm.
            </p>
            <p className="text-xl font-semibold text-gray-900 text-center pt-8">
              This is not about perfection.<br />
              It's about progress, presence, and clarity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What It Is Section */}
      <section id="what-it-is" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What It Is
            </h2>
            <p className="text-2xl text-gray-700 font-semibold mb-4">
              A Simple Daily Practice.
            </p>
            <p className="text-2xl text-[#7667E5] font-semibold mb-8">
              Powerful Long-Term Insight.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Smart Inventory turns reflection into a habit. Instead of random journaling, you check in with yourself using structured inventories that build awareness, accountability, and emotional intelligence over time.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed">
              Whether you reflect in the morning or unwind at night, Smart Inventory helps you notice patterns, track progress, and grow with intention.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] hover:from-[#6557D5] hover:to-[#4A8FDD] text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            >
              Create Your Free Account
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                step: 1,
                title: 'Check In Daily or Nightly',
                description: 'Answer guided inventory prompts in just a few minutes. No overthinking. No blank pages.',
                icon: Calendar
              },
              {
                step: 2,
                title: 'Reflect With AI Insights',
                description: 'Your entries are summarized and analyzed by AI to highlight emotional trends, blind spots, and growth patterns you may miss on your own.',
                icon: Sparkles
              },
              {
                step: 3,
                title: 'Track Your Growth',
                description: 'Build streaks, review past reflections, and see how your mindset and habits evolve over time.',
                icon: TrendingUp
              },
              {
                step: 4,
                title: 'Stay Consistent',
                description: 'Set reminders, choose your preferred themes, and make reflection part of your daily rhythm.',
                icon: Bell
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#7667E5] to-[#5B9FED] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.step}. {item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] hover:from-[#6557D5] hover:to-[#4A8FDD] text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            >
              Start My First Inventory
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            Core Features
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Guided Daily & Nightly Inventories',
                description: 'Structured prompts that help you reflect with clarity and honesty.',
                icon: CheckCircle2
              },
              {
                title: 'AI-Generated Summaries & Prompts',
                description: 'Get personalized insights and follow-up questions based on your own words.',
                icon: Sparkles
              },
              {
                title: 'Streak & Progress Tracking',
                description: 'Visualize consistency and stay motivated without pressure or guilt.',
                icon: TrendingUp
              },
              {
                title: 'Customizable Themes',
                description: 'Make the app feel like your space. Calm, dark, light, or minimal.',
                icon: Sparkles
              },
              {
                title: 'Smart Reminders',
                description: 'Gentle nudges to help you stay present and consistent.',
                icon: Bell
              },
              {
                title: 'Private & Secure',
                description: 'Your thoughts stay yours. Always.',
                icon: Lock
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <feature.icon className="w-10 h-10 text-[#7667E5] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] hover:from-[#6557D5] hover:to-[#4A8FDD] text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            >
              Sign Up Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12"
          >
            Who It's For
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12"
          >
            <p className="text-xl text-gray-700 mb-6">
              Smart Inventory is for people who want to:
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Build self-awareness',
                'Improve emotional regulation',
                'Track personal growth',
                'Create consistency without overwhelm',
                'Reflect honestly without judgment'
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-lg text-gray-700"
                >
                  <CheckCircle2 className="w-6 h-6 text-[#7667E5] flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
            <p className="text-lg text-gray-600">
              Whether you're on a personal development journey, in recovery, navigating relationships, or just trying to live more intentionally, Smart Inventory meets you where you are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Smart Inventory */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
          >
            Why Smart Inventory
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-xl text-gray-700 mb-12"
          >
            <p className="font-semibold">
              Most journaling apps give you a blank page.<br />
              Smart Inventory gives you direction, insight, and momentum.
            </p>
            <p className="text-2xl font-bold text-[#7667E5]">
              This isn't about writing more.<br />
              It's about seeing yourself more clearly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] hover:from-[#6557D5] hover:to-[#4A8FDD] text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            >
              Create My Account
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#7667E5] to-[#5B9FED]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Start Reflecting Today
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-10"
          >
            It takes less than 5 minutes a day to build awareness that compounds for life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="bg-white text-[#7667E5] hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg"
            >
              Start Free Now
            </Button>
            <Button 
              onClick={handleCTA}
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
            >
              Sign Up
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">Smart Inventory</h3>
          <p className="text-gray-400 mb-6">Daily reflection. Clear growth.</p>
          <p className="text-sm text-gray-500">© Smart Inventory</p>
        </div>
      </footer>
    </div>
  );
}