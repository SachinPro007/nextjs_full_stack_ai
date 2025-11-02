"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { User } from "@/convex/users";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "@/convex/schema";
import z from "zod/v3";

function CreatePost() {
  const { data: existingDraft, isLoading: isDraftLoading } = useConvexQuery(
    api.posts.getDraftPost,
  ) as { data: Post | undefined; isLoading: boolean };
  const { data: currentUser, isLoading: isUserLoading } = useConvexQuery(
    api.users.getCurrentUser,
  ) as { data: User | undefined; isLoading: boolean };

  if (isDraftLoading || isUserLoading) {
    return <BarLoader width={"100%"} color="#3b82f6" />;
  }

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
      CreatePost
      <PostEditor initialData={existingDraft} />
    </div>
  );
}

export default CreatePost;

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Title is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowd"),
  featuredImage: z.string().optional(),
  scheduledFor: z.number().optional(),
});

function PostEditor({
  initialData,
  mode = "create",
}: {
  initialData: Post | undefined;
  mode?: string;
}) {
  const { mutate: createPost, isLoading: isCreating } = useConvexMutation(
    api.posts.createPost,
  );
  const { mutate: updatePost, isLoading: isUpdating } = useConvexMutation(
    api.posts.updatePost,
  );

  useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      featuredImage: initialData?.featuredImage || "",
      scheduledFor: initialData?.scheduledFor || undefined,
    },
  });
  return <div>Post Editor</div>;
}
