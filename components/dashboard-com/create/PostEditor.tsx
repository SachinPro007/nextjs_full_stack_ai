import { zodResolver } from "@hookform/resolvers/zod";
import PostEditorHeader from "./PostEditorHeader";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { useState } from "react";
import { Post } from "@/convex/schema";
import z from "zod/v3";
import PostContentEditor from "./PostContentEditor";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Title is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowd"),
  featuredImage: z.string().optional(),
  scheduledFor: z.string().optional(),
});

interface PostEditorFnProp {
  initialData: Post | undefined;
  mode?: "edit" | "create";
}

// Post
function PostEditor({ initialData, mode = "create" }: PostEditorFnProp) {
  const [isSettingsOpen, setIsSettingOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalType, setImageModalType] = useState("featured");
  const [quillRef, setQuillRef] = useState<unknown | null>(null);

  const { mutate: createPost, isLoading: isCreating } = useConvexMutation(
    api.posts.createPost,
  );

  const { mutate: updatePost, isLoading: isUpdating } = useConvexMutation(
    api.posts.updatePost,
  );

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      featuredImage: initialData?.featuredImage || "",
      scheduledFor: initialData?.scheduledFor
        ? new Date(initialData.scheduledFor).toString().slice(0, 16)
        : "",
    },
  });

  const handleSave = () => {};
  const handlePublish = () => {};
  const handleSchedule = () => {};

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PostEditorHeader
        mode={mode}
        initialData={initialData}
        isPublishing={isCreating || isUpdating}
        onSave={handleSave}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
        onSettingsOpen={() => setIsSettingOpen(true)}
      />

      {/* editor */}
      <PostContentEditor
        form={form}
        setQuillRef={setQuillRef}
        onImageUpload={(type: string) => {
          setImageModalType(type);
          setIsImageModalOpen(true);
        }}
      />

      {/* Settings dialog*/}

      {/* image upload dialog */}
    </div>
  );
}

export default PostEditor;
