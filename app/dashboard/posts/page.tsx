"use client";

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();

  const { data: posts, isLoading } = useConvexQuery(api.posts.getUserAllPosts);
  const { mutate } = useConvexMutation(api.posts.deletePost);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  return <div>Thsi is Your All postsPage Handle Page</div>;
}

export default PostsPage;
