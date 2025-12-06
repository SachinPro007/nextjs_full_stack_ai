"use client";

import PostEditor from "@/components/dashboard-com/create/PostEditor";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function EditPost() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // if user not logged, Redirect to hpme page
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      return router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  
  const { id } = useParams();
  const { data: post, isLoading } = useConvexQuery(api.posts.getPostById, {
    _id: id,
  });

  if (isLoading) {
    return <BarLoader width={"100%"} color="#3b82f6" />;
  }

  return (
    <div className="pt-20">
      <PostEditor initialData={post} mode="edit" />
    </div>
  );
}

export default EditPost;
