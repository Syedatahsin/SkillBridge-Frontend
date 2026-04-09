"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

const AboutPage = () => {
  // Animation Variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 transition-colors duration-300">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          
          {/* Left Side: Text Content */}
          <div className="space-y-8">
            <motion.div variants={fadeInUp}>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                About <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">SkillBridge</span>
              </h1>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Great teachers are everywhere, but many lack the platform to share their expertise. 
                At the same time, countless students struggle to find that one individual who 
                truly understands their learning style.
              </p>
              
              <div className="h-px w-full bg-gradient-to-r from-purple-500/50 to-transparent" />

              <p className="text-foreground/90 font-medium">
                SkillBridge was created to solve both sides of the equation. 
                We empower knowledgeable educators by giving them the digital home they deserve, 
                while helping students cut through the noise to find their perfect mentor.
              </p>

              <p>
                We don't just facilitate lessons; we build the personal connections that turn 
                <span className="text-purple-400 font-semibold"> potential into mastery.</span>
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4">
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 transition-all rounded-full font-semibold shadow-[0_0_20px_rgba(147,51,234,0.3)] text-white">
                Find a Mentor
              </button>
              <button className="px-8 py-4 border border-border hover:bg-muted transition-all rounded-full font-semibold">
                Start Teaching
              </button>
            </motion.div>
          </div>

          {/* Right Side: Image with Animated Border */}
          <motion.div 
            variants={fadeInUp}
            className="relative group"
          >
            {/* Decorative Gradient Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] w-full rounded-2xl overflow-hidden border border-border bg-card transition-colors duration-300">
              {/* Replace the src with your actual image path */}
              <Image 
                src="/aboutus.avif"
                alt="Mentorship and Collaboration"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              
              {/* Floating Badge Detail */}
              <div className="absolute bottom-8 left-8 p-4 bg-card/80 backdrop-blur-md border border-purple-500/30 rounded-xl transition-colors duration-300">
                <p className="text-sm font-bold text-purple-400 uppercase tracking-widest">Live 1:1 Sessions</p>
                <p className="text-xs text-muted-foreground">Personalized learning at your pace.</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
};

export default AboutPage;
