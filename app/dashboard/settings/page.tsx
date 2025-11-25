"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import {
  Calendar,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Save,
  Shield,
  Sparkles,
  User,
  AlignLeft,
} from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

// --- Types ---
interface CurrentUser {
  _id: string;
  username?: string;
  bio?: string;
  state?: string;
  country?: string;
  email?: string;
  _creationTime: number;
}

function SettingsPage() {
  // Fetch User Data
  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser,
  ) as { data: CurrentUser | undefined; isLoading: boolean };

  //Mutation update user profile
  const { mutate, isLoading: isSubmitting } = useConvexMutation(
    api.users.updateProfile,
  ) as {
    mutate: (args: {
      username: string;
      bio?: string;
      state?: string;
      country?: string;
    }) => Promise<string>;
    isLoading: boolean;
  };

  // 3. Form State
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    if (currentUser) {
      // eslint-disable-next-line
      setFormData({
        username: currentUser.username || "",
        bio: currentUser.bio || "",
        state: currentUser.state || "",
        country: currentUser.country || "",
      });
    }
  }, [currentUser]);

  // 5. Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 6. Submit Logic
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedUsername = formData.username.trim();

    // Validation
    if (
      !trimmedUsername ||
      trimmedUsername.length < 3 ||
      trimmedUsername.length > 20
    ) {
      toast.error("Username must be between 3 and 20 characters");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      toast.error("Username: Letters, numbers, underscores, and hyphens only");
      return;
    }

    if (formData.bio.length > 300) {
      toast.error("Bio must be less than 300 characters");
      return;
    }

    try {
      await mutate({
        username: trimmedUsername,
        bio: formData.bio.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific "Username taken" error from backend
        if (error.message.includes("taken")) {
          toast.error("Username already taken");
        } else {
          toast.error("Failed to update profile");
        }
      }
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse" />
          <div className="relative bg-white p-4 rounded-2xl shadow-xl border border-indigo-100">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- HEADER --- */}
      <div className="mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-2">
          <SettingsIconWrapper />
          <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase">
            Account Management
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Settings & Preference
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl">
          Manage your public identity, bio, and location details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN: Form --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Public Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300">
            {/* Card Header Decoration */}
            <div className="p-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10" />

            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Public Profile
                  </h2>
                  <p className="text-sm text-slate-500">
                    This information will be displayed on your blog profile.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Username Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="username"
                    className="text-sm font-semibold text-slate-700 flex justify-between"
                  >
                    <span>Display Name (Username)</span>
                    <span className="text-xs font-normal text-slate-400">
                      Required
                    </span>
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-slate-400 font-medium group-focus-within:text-indigo-500 transition-colors">
                      @
                    </div>
                    <Input
                      id="username"
                      disabled={isSubmitting}
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="username"
                      className="pl-9 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all text-base"
                    />
                    {formData.username &&
                      formData.username !== currentUser?.username && (
                        <div className="absolute right-4 top-3.5 animate-in zoom-in">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                      )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      3-20 chars
                    </span>
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      No special chars
                    </span>
                  </div>
                </div>

                {/* 2. Bio Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-semibold text-slate-700 flex justify-between"
                  >
                    <span>Bio</span>
                    <span
                      className={`text-xs ${formData.bio.length > 300 ? "text-red-500 font-bold" : "text-slate-400"}`}
                    >
                      {formData.bio.length}/300
                    </span>
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <AlignLeft className="w-5 h-5" />
                    </div>
                    <Textarea
                      id="bio"
                      disabled={isSubmitting}
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell the world a bit about yourself..."
                      className="pl-11 min-h-[120px] bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all resize-none text-base py-3 leading-relaxed"
                    />
                  </div>
                </div>

                {/* 3. Location Fields (Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* State */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="state"
                      className="text-sm font-semibold text-slate-700"
                    >
                      State / Province
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <Input
                        id="state"
                        disabled={isSubmitting}
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="e.g. California"
                        className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="country"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Country
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Globe className="w-5 h-5" />
                      </div>
                      <Input
                        id="country"
                        disabled={isSubmitting}
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="e.g. USA"
                        className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end pt-6 border-t border-slate-100">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Info --- */}
        <div className="space-y-6">
          {/* Account Details */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-500" />
              Account Details
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group">
                <div className="flex items-center gap-3 mb-1">
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </span>
                </div>
                <p className="text-slate-700 font-medium truncate pl-7">
                  {currentUser?.email || "No email linked"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group">
                <div className="flex items-center gap-3 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Member Since
                  </span>
                </div>
                <p className="text-slate-700 font-medium pl-7">
                  {currentUser?._creationTime
                    ? new Date(currentUser._creationTime).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Upgrade / Pro Badge */}
          <div className="rounded-3xl p-6 bg-linear-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-200 overflow-hidden relative group">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1">Ezensi Pro</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Upgrade to unlock AI auto-complete, advanced analytics and
                custom domains.
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0 rounded-xl font-bold"
              >
                View Plans
              </Button>
            </div>
            {/* Decoration */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper for the animated header icon
function SettingsIconWrapper() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
    </span>
  );
}

export default SettingsPage;
