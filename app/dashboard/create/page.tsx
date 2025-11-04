"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { User } from "@/convex/users";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { Post } from "@/convex/schema";
import PostEditor from "@/components/dashboard-com/create/PostEditor";

interface GetDraftPost {
  data: Post | undefined;
  isLoading: boolean;
}

interface GetCurrentUser {
  data: User | undefined;
  isLoading: boolean;
}

function CreatePost() {
  const { data: existingDraft, isLoading: isDraftLoading } = useConvexQuery(
    api.posts.getDraftPost,
  ) as GetDraftPost;
  const { data: currentUser, isLoading: isUserLoading } = useConvexQuery(
    api.users.getCurrentUser,
  ) as GetCurrentUser;

  if (isDraftLoading || isUserLoading) {
    return <BarLoader width={"100%"} color="#3b82f6" />;
  }

  // If current user not set username then first set it
  if (!currentUser?.username) {
    return (
      <div className="h-80 bg-slate-900 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">Username Required</h1>
          <p className="text-slate-400 text-lg">
            Set up a username to create and share your posts
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/settings">
              <Button variant="outline">
                Set Up Username
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PostEditor initialData={existingDraft} />
    </div>
  );
}

export default CreatePost;
