"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, DollarSign, BookOpen, Check, UserCircle, Landmark, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 

interface Category {
  id: string;
  name: string;
}

export default function CompleteFullProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingCats, setFetchingCats] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/get`);
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setFetchingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const form = useForm({
    defaultValues: {
      bio: "",
      experience: 0,
      pricePerHour: 0,
      categoryIds: [] as string[],
      bankAccountNumber: "", 
    },
    onSubmit: async ({ value }) => {
      if (!session?.user?.id) {
        toast.error("You must be logged in to create a profile.");
        return;
      }

      if (value.categoryIds.length === 0) {
        toast.error("Please select at least one subject.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            bio: value.bio,
            experience: Number(value.experience),
            pricePerHour: parseFloat(value.pricePerHour.toString()),
            categoryIds: value.categoryIds,
            bankAccountNumber: value.bankAccountNumber, 
          }),
        });

        if (response.ok) {
          toast.success("Professional profile published!");
          router.push("/teacher");
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to save profile");
        }
      } catch (error) {
        toast.error("Server connection failed.");
      } finally {
        setLoading(false);
      }
    },
  });

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500 size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4">
      <Card className="max-w-3xl mx-auto bg-[#0A0A0B] border-white/10 shadow-2xl rounded-[2.5rem]">
        <CardHeader className="text-center pt-10">
          <div className="flex justify-center mb-4">
            {session?.user?.image ? (
              <img src={session.user.image} className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/20" alt="Avatar" />
            ) : (
              <UserCircle className="text-purple-500 size-16 opacity-50" />
            )}
          </div>
          <CardTitle className="text-3xl font-black text-white uppercase tracking-tight">
            Finalize <span className="text-purple-500">Tutor Profile</span>
          </CardTitle>
          <CardDescription className="text-gray-500 mt-2 italic">
            Signed in as: {session?.user?.email}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-8">
            
            <form.Field name="bio">
              {(field) => (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">About You</label>
                  <Textarea
                    placeholder="Describe your teaching background..."
                    className="bg-white/5 border-white/10 text-white min-h-[120px] focus:border-purple-500 rounded-2xl p-4"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field name="experience">
                {(field) => (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Briefcase size={14} className="text-purple-500" /> Experience (Years)
                    </label>
                    <Input
                      type="number"
                      className="bg-white/5 border-white/10 text-white h-14 rounded-2xl"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      required
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="pricePerHour">
                {(field) => (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <DollarSign size={14} className="text-purple-500" /> Hourly Rate ($)
                    </label>
                    <Input
                      type="number"
                      className="bg-white/5 border-white/10 text-white h-14 rounded-2xl"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                      required
                    />
                  </div>
                )}
              </form.Field>
            </div>

            {/* BANK ACCOUNT NUMBER FIELD WITH REASSURANCE */}
            <form.Field name="bankAccountNumber">
              {(field) => (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Landmark size={14} className="text-purple-500" /> Payout Account Number
                  </label>
                  <Input
                    placeholder="Ex: 0123456789 (Cannot be changed later)"
                    className="bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:border-purple-500"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                  <div className="flex items-start gap-2 mt-2 px-2">
                    <AlertCircle size={12} className="text-amber-500 mt-0.5" />
                    <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest leading-relaxed">
                      Please double-check. For security, you cannot modify <br/> this number once your profile is forged.
                    </p>
                  </div>
                </div>
              )}
            </form.Field>

            <form.Field name="categoryIds">
              {(field) => (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Subjects of Expertise</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const isSelected = field.state.value.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            const next = isSelected 
                              ? field.state.value.filter(id => id !== cat.id)
                              : [...field.state.value, cat.id];
                            field.handleChange(next);
                          }}
                          className={`p-3 text-[11px] font-bold uppercase rounded-xl border transition-all flex items-center justify-between ${
                            isSelected 
                              ? "bg-purple-600 border-purple-500 text-white shadow-lg" 
                              : "bg-white/5 border-white/10 text-gray-500 hover:border-purple-500/40"
                          }`}
                        >
                          {cat.name}
                          {isSelected && <Check size={14} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </form.Field>

            <Button
              type="submit"
              disabled={loading || fetchingCats}
              className="w-full h-16 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-purple-500/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Complete My Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}