"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Label } from "@/components/ui/label";
import { User, Settings as SettingsIcon } from "lucide-react";
import React, { FormEvent, useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

// Define proper TypeScript interfaces for the data
interface CurrentUser {
  _id: string;
  username?: string;
  email?: string;
  _creationTime: number;
}

function SettingsPage() {
  const [username, setUsername] = useState("");
  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser,
  ) as { data: CurrentUser | undefined; isLoading: boolean };

  const { mutate, isLoading: isSubmitting } = useConvexMutation(
    api.users.updateUsername,
  ) as {
    mutate: (args: { username: string }) => Promise<void>;
    isLoading: boolean;
  };

  // Set current username when data loads
  useEffect(() => {
    if (currentUser?.username) {
      // eslint-disable-next-line
      setUsername(currentUser.username);
    }
  }, [currentUser?.username]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Trim and validate username
    const trimmedUsername = username.trim();

    if (
      !trimmedUsername ||
      trimmedUsername.length < 3 ||
      trimmedUsername.length > 20
    ) {
      toast.error("Username must be between 3 and 20 characters");
      return;
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      toast.error(
        "Username can only contain letters, numbers, underscores, and hyphens",
      );
      return;
    }

    // Check if username actually changed
    if (trimmedUsername === currentUser?.username) {
      toast.info("Username is already set to this value");
      return;
    }

    try {
      await mutate({ username: trimmedUsername });
      toast.success("Username updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update username");
      }
    }
  };

  if (isLoading) {
    return <BarLoader width={"100%"} color="#3b82f6" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile and account preferences
            </p>
          </div>
        </div>
      </div>

      {/* Username Card */}
      <div className="grid gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              Username Settings
            </CardTitle>
            <CardDescription className="text-base">
              Set your unique username for your public profile
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  disabled={isSubmitting}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="h-11"
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_-]+"
                  title="Letters, numbers, underscores, and hyphens only"
                />

                {/* Current Username Display */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Current username:
                  </span>
                  <span className="font-medium text-primary">
                    @{currentUser?.username || "not set"}
                  </span>
                </div>

                {/* Validation Rules */}
                <CardDescription className="text-sm pt-2">
                  3-20 characters, letters, numbers, underscores, and hyphens
                  only
                </CardDescription>
              </div>

              {/* Character Count */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {username.length}/20 characters
                </div>

                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    username.trim() === currentUser?.username ||
                    username.trim().length < 3
                  }
                  className="min-w-32"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <BarLoader width={20} height={2} color="#ffffff" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Username"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Settings Cards can be added here */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl">Account Information</CardTitle>
            <CardDescription>View your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentUser?.email || "Not available"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Member since</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentUser?._creationTime
                    ? new Date(currentUser._creationTime).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;
