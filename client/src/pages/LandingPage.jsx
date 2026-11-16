
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  ClipboardList,
  Flag,
  ChartNoAxesCombined,
  CalendarDays,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

// Animation variants
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut'
    }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Feature data
const features = [
  {
    icon: ClipboardList,
    title: 'Task Management',
    description:
      'Create, update and organize your tasks in one convenient place.'
  },
  {
    icon: Flag,
    title: 'Priority Control',
    description:
      'Set task priorities and focus on what matters most.'
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Progress Tracking',
    description:
      "Monitor your progress and see what you've completed."
  },
  {
    icon: CalendarDays,
    title: 'Due Date Tracking',
    description:
      'Keep track of deadlines and stay ahead of upcoming tasks.'
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-secondary)] overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative isolate min-h-[85vh] flex items-center justify-center text-center px-5 py-24 overflow-hidden bg-[#17243D]">

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(102,139,203,0.22),transparent_60%)]"></div>

        <div className="absolute -top-40 -left-40 -z-10 w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px]"></div>

        <div className="absolute -bottom-40 -right-20 -z-10 w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-[130px]"></div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >

          <motion.span
            variants={fadeUp}
            className="inline-block text-sm font-semibold tracking-[0.2em] text-[#9BB7E5] mb-7"
          >
            TASK MANAGEMENT MADE SIMPLE
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight"
          >
            Make Every Task
            <span className="block text-[var(--color-accent)] mt-2">
              Count.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Stay organized, prioritize your work, and keep track
            of everything that matters. Manage your daily tasks
            in one simple place.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >

            <Link
              to="/register"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:brightness-110 transition duration-200"
            >
              Get Started
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              to="/login"
              className="px-8 py-3.5 rounded-lg border border-white/30 text-white font-medium hover:bg-white/10 transition duration-200"
            >
              Login
            </Link>

          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center justify-center gap-2 text-sm text-white/50"
          >
            <CheckCircle2 size={16} className="text-[#9BB7E5]" />
            <span>Simple. Organized. Productive.</span>
          </motion.div>

        </motion.div>
      </section>


      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="px-5 pt-16 pb-16 sm:pt-24 sm:pb-28">

        <div className="max-w-5xl mx-auto">

          {/* Section Heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >

            <span className="text-sm font-semibold tracking-widest text-[var(--color-accent)]">
              YOUR WORKSPACE
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mt-4">
              Everything you need, in one place.
            </h2>

            <p className="text-[var(--color-muted)] mt-4 max-w-xl mx-auto leading-relaxed">
              A simple overview to keep your work organized
              and your daily goals on track.
            </p>

          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_12px_40px_rgba(28,41,66,0.09)] overflow-hidden"
          >

            {/* Dashboard Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-[var(--color-border)]">

              <div>
                <h3 className="font-semibold text-lg text-[var(--color-primary)]">
                  Dashboard
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Your task overview
                </p>
              </div>

              <span className="text-sm text-[var(--color-muted)]">
                Welcome back!
              </span>

            </div>

            <div className="p-5 sm:p-8">

              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">

                {[
                  { title: 'Total Tasks', value: '12', color: 'text-[var(--color-primary)]' },
                  { title: 'In Progress', value: '05', color: 'text-[var(--color-accent)]' },
                  { title: 'Completed', value: '07', color: 'text-[var(--color-success)]' }
                ].map((item) => (

                  <div
                    key={item.title}
                    className="p-5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]/70"
                  >
                    <p className="text-sm text-[var(--color-muted)]">
                      {item.title}
                    </p>

                    <h3 className={`text-3xl font-bold mt-2 ${item.color}`}>
                      {item.value}
                    </h3>
                  </div>

                ))}

              </div>

              {/* Recent Tasks */}
              <div>

                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-[var(--color-primary)]">
                    Recent Tasks
                  </h3>

                  <span className="text-xs text-[var(--color-muted)]">
                    Sample Preview
                  </span>
                </div>

                <div className="space-y-3">

                  {[
                    {
                      title: 'Complete project documentation',
                      priority: 'High Priority',
                      status: 'In Progress',
                      badge: 'bg-[var(--color-info-bg)] text-[var(--color-info)]'
                    },
                    {
                      title: 'Review weekly goals',
                      priority: 'Medium Priority',
                      status: 'Completed',
                      badge: 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                    },
                    {
                      title: 'Prepare presentation',
                      priority: 'Low Priority',
                      status: 'Not Started',
                      badge: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                    }
                  ].map((task) => (

                    <div
                      key={task.title}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-secondary)]/50 transition"
                    >

                      <div>
                        <p className="font-medium text-sm sm:text-base text-[var(--color-text)]">
                          {task.title}
                        </p>

                        <p className="text-xs text-[var(--color-muted)] mt-1">
                          {task.priority}
                        </p>
                      </div>

                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${task.badge}`}>
                        {task.status}
                      </span>

                    </div>

                  ))}

                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>


      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-white px-5 py-16 sm:py-24">

        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >

            <span className="text-sm font-semibold tracking-widest text-[var(--color-accent)]">
              FEATURES
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mt-4">
              Everything you need to stay productive.
            </h2>

            <p className="text-[var(--color-muted)] mt-4 leading-relaxed">
              Simple tools to help you organize your work,
              manage priorities and stay on top of your tasks.
            </p>

          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >

            {features.map((feature) => {

              const Icon = feature.icon;

              return (

                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group p-5 sm:p-6 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:shadow-[var(--shadow-card)] transition-all duration-300"
                >

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-secondary)] text-[var(--color-accent)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">

                    <Icon size={24} strokeWidth={1.8} />

                  </div>

                  <h3 className="text-lg font-semibold text-[var(--color-primary)] mt-6">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-3">
                    {feature.description}
                  </p>

                </motion.div>

              );

            })}

          </motion.div>

        </div>
      </section>


      {/* ================= CALL TO ACTION ================= */}
      <section className="relative overflow-hidden bg-[#17243D] px-5 py-24">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(102,139,203,0.16),transparent_65%)]"></div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >

          <span className="text-sm font-semibold tracking-widest text-[#9BB7E5]">
            START TODAY
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mt-5">
            Ready to take control of your tasks?
          </h2>

          <p className="text-white/70 text-base sm:text-lg mt-5 leading-relaxed max-w-2xl mx-auto">
            Start organizing your work, managing your priorities,
            and making progress every day.
          </p>

          <div className="mt-9">

            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:brightness-110 transition duration-200"
            >
              Get Started
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

          </div>

        </motion.div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-[var(--color-border)] px-5 py-8">

        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            <div className="text-center sm:text-left">

              <h2 className="text-xl font-bold text-[var(--color-primary)]">
                Task Manager.
              </h2>

              <p className="text-sm text-[var(--color-muted)] mt-1">
                Plan better. Stay organized. Get things done.
              </p>

            </div>

            <p className="text-sm text-[var(--color-muted)] text-center">
              © {new Date().getFullYear()} Task Manager. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default LandingPage;
