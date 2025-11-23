"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  Mail,
  Save,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";

// --- Types ---
interface CurrentUser {
  _id: string;
  username?: string;
  email?: string;
  _creationTime: number;
}

function SettingsPage() {
  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser,
  ) as { data: CurrentUser | undefined; isLoading: boolean };

  const { mutate, isLoading: isSubmitting } = useConvexMutation(
    api.users.updateUsername,
  ) as {
    mutate: (args: { username: string }) => Promise<void>;
    isLoading: boolean;
  };

  // Sync state with data
  const [username, setUsername] = useState(currentUser?.username || "");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

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
      toast.error("Letters, numbers, underscores, and hyphens only");
      return;
    }

    if (trimmedUsername === currentUser?.username) {
      toast.info("No changes made");
      return;
    }

    try {
      const res = (await mutate({ username: trimmedUsername })) as
        | string
        | undefined;
      if (res) {
        toast.success("Username updated successful");
      } else {
        toast.error("Username already taken");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update settings");
      }
    }
  };

  // --- Loading State (Matched to Dashboard) ---
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
    <div className="max-w-4xl mx-auto pt-20 pb-16 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          Manage your public identity and account security details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN: Form --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300">
            <div className="p-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10" />
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Public Profile
                  </h2>
                  <p className="text-sm text-slate-500">
                    This is how you appear to others on Ezensi.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="username"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Display Name (Username)
                  </Label>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-slate-400 font-medium">
                      @
                    </div>
                    <Input
                      id="username"
                      disabled={isSubmitting}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="pl-9 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all text-base"
                    />
                    {username && username !== currentUser?.username && (
                      <div className="absolute right-4 top-3.5 animate-in zoom-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    )}
                  </div>

                  {/* Guidelines */}
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      3-20 chars
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      No special chars
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-sm text-slate-500">
                    Current:{" "}
                    <span className="font-bold text-slate-700">
                      @{currentUser?.username || "N/A"}
                    </span>
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting || username.trim() === currentUser?.username
                    }
                    className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
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

          {/* Upgrade / Pro Badge (Optional Visual Flair) */}
          <div className="rounded-3xl p-6 bg-linear-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-200 overflow-hidden relative group">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1">Ezensi Pro</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Upgrade to unlock AI auto-complete and custom domains.
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
