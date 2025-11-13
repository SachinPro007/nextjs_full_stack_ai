"use client";

import PostEditor from "@/components/dashboard-com/create/PostEditor";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useParams } from "next/navigation";
import React from "react";
import { BarLoader } from "react-spinners";

function EditPost() {
  const { id } = useParams();
  const { data: post, isLoading } = useConvexQuery(api.posts.getPostById, {
    _id: id,
  });

  if (isLoading) {
    return <BarLoader width={"100%"} color="#3b82f6" />;
  }

  return <PostEditor initialData={post} mode="edit" />;
}

export default EditPost;
