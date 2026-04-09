"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Replace this with your actual Web3Forms Access Key
  const ACCESS_KEY = "ca99496a-c08e-4068-aac3-5c0d101e82aa";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", ACCESS_KEY);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      toast.success("Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden flex items-center transition-colors duration-300">
      {/* Background Gradient Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                Get in <span className="text-purple-500">Touch</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Have questions about 1:1 sessions? Whether you&apos;re a teacher or a student, we&apos;re here to help you bridge the gap.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="p-3 rounded-lg bg-card border border-border group-hover:border-purple-500 transition-colors">
                  <Mail className="text-purple-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Email Us</p>
                  <p className="text-foreground/90">anikasyeda82@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 rounded-lg bg-card border border-border group-hover:border-purple-500 transition-colors">
                  <MessageSquare className="text-purple-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Live Chat</p>
                  <p className="text-foreground/90">Available Mon-Fri, 9am-6pm</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20" />
            <div className="relative bg-card backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl transition-all">
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Route submissions to the correct email */}
                <input type="hidden" name="to_email" value="anikasyeda82@gmail.com" />

                <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Full Name</label>
                  <Input 
                    name="name"
                    required
                    placeholder="Enter your name"
                    className="bg-muted/10 border-border focus:border-purple-500 transition-all py-6 text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Email Address</label>
                  <Input 
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="bg-muted/10 border-border focus:border-purple-500 transition-all py-6 text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Message</label>
                  <Textarea 
                    name="message"
                    required
                    placeholder="How can we help you?"
                    className="bg-muted/10 border-border focus:border-purple-500 transition-all min-h-[150px] text-foreground"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all flex gap-2 shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
