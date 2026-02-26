"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Footer() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const formData = new FormData(e.target as HTMLFormElement);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("http://localhost:5000/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Message sent successfully!");
        e.target.reset();
      } else {
        setSuccess("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      setSuccess("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <footer className="bg-black text-white border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Connect</span>
              </h2>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                Have questions about SkillBridge? Reach out to me directly and let&apos;s build something amazing together.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Call Me</p>
                  <p className="text-lg font-medium">+880 1738 980541</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Email</p>
                  <p className="text-lg font-medium underline underline-offset-4 decoration-purple-500/50">
                    anikasyeda82@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
  {[
    { Icon: Github, url: "https://github.com/Syedatahsin" },
    { Icon: Linkedin, url: "https://www.linkedin.com/in/syeda-anika-234376362?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
    { Icon: Instagram, url: "https://www.instagram.com/2000__whynot__?utm_source=qr&igsh=cmQ0N3ltcWFvMDNr" },
  ].map(({ Icon, url }, i) => (
    <a
      key={i}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full"
    >
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-white/10 bg-white/5 hover:bg-purple-600 hover:border-purple-600 transition-all"
      >
        <Icon size={18} />
      </Button>
    </a>
  ))}
</div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-2">Full Name</label>
                  <Input
                    name="name"
                    placeholder="John Doe"
                    className="bg-black/50 border-white/10 rounded-2xl h-12 focus-visible:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-2">Email</label>
                  <Input
                    name="email"
                    placeholder="john@example.com"
                    className="bg-black/50 border-white/10 rounded-2xl h-12 focus-visible:ring-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">Message</label>
                <Textarea
                  name="message"
                  placeholder="How can I help you?"
                  className="bg-black/50 border-white/10 rounded-2xl min-h-[120px] focus-visible:ring-purple-500 resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all text-lg font-bold shadow-lg shadow-purple-500/20"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="ml-2 size-4" />
              </Button>
              {success && <p className="text-center mt-2 text-green-400">{success}</p>}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm italic">
            Designed & Developed by <span className="text-white font-bold not-italic">Syeda Anika Tahsin</span>
          </p>
          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            <p>© 2026 SkillBridge</p>
          </div>
        </div>
      </div>
    </footer>
  );
}