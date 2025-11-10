import { zodResolver } from "@hookform/resolvers/zod";
import PostEditorHeader from "./PostEditorHeader";
import { useForm, useWatch } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { useState } from "react";
import { Post } from "@/convex/schema";
import z from "zod/v3";
import PostContentEditor, { PostFormData } from "./PostContentEditor";
import PostEditorSettings from "./PostEditorSettings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ImageUploadPopUp from "./ImageUploadPopUp";
import ReactQuill from "react-quill-new";

// zod validation
const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Title is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowd"),
  featuredImage: z.string().optional(),
  scheduledFor: z.string().optional(),
});

// types
export interface ImageDataObj {
  url: string;
  originalUrl: string | undefined;
  fileId: string | undefined;
  name: string | undefined;
  width: number | undefined;
  height: number | undefined;
}

interface PostEditorFnProp {
  initialData: Post | undefined;
  mode?: "edit" | "create";
}

// Post
function PostEditor({ initialData, mode = "create" }: PostEditorFnProp) {
  const router = useRouter();
  const [isSettingsOpen, setIsSettingOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalType, setImageModalType] = useState<"featured" | "content">(
    "featured",
  );
  const [quillRef, setQuillRef] = useState<ReactQuill | null>(null);

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

  const { control, handleSubmit, setValue } = form;
  const watchValue = useWatch({ control });

  // Submit Post Data
  const onSubmit = async (
    data: PostFormData,
    action: "draft" | "publish" | "schedule",
  ) => {
    try {
      console.log("log in on Submit fun in postEditor");
      const postData = {
        title: data.title,
        content: data.content,
        category: data.category || undefined,
        tags: data.tags,
        featuredImage: data.featuredImage || undefined,
        status: action === "publish" ? "published" : "draft",
        scheduledFor: data.scheduledFor
          ? new Date(data.scheduledFor).getDate()
          : undefined,
      };

      let resultId;

      if (mode === "edit" && initialData?._id) {
        // always use update for edit mode
        resultId = await updatePost({ _id: initialData?._id, ...postData });
      } else if (initialData?._id && action === "draft") {
        // if we have existing draft data, update it
        resultId = await updatePost({ _id: initialData?._id, ...postData });
      } else {
        // create new post (will auto-update draft if needed)
        resultId = await createPost(postData);
      }

      const message =
        action === "publish"
          ? "Post published"
          : action === "schedule"
            ? "Post scheduled"
            : "Post save in Draft";
      toast.success(message);

      if (action === "publish" || action === "schedule") {
        router.push("/dashboard/posts");
      }

      return resultId;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Faild to save post");
        throw error;
      }
    }
  };

  // handler functions
  const handleSave = () => {
    handleSubmit((data) => onSubmit(data, "draft"))();
  };

  const handlePublish = () => {
    handleSubmit((data) => onSubmit(data, "publish"))();
  };

  const handleSchedule = () => {
    if (!watchValue.scheduledFor) {
      return toast.error("Please select a date and time to schedule");
    }

    handleSubmit((data) => onSubmit(data, "schedule"))();
  };

  const handleImageSelect = (imageData: ImageDataObj) => {
    if (imageModalType === "featured") {
      setValue("featuredImage", imageData.url);
      toast.success("Featured image added");
    } else if (imageModalType === "content" && quillRef) {
      const quill = quillRef.getEditor();
      const range = quill.getSelection();

      const index = range ? range.index : quill.getLength();

      quill.insertEmbed(index, "image", imageData.url);
      quill.setSelection(index + 1);
      toast.success("Image inserted!");
    }

    setIsImageModalOpen(false);
  };

  // Auto-Save for draft
  // useEffect(() => {
  //   if (!watchValue.title || !watchValue.content) return;

  //   const autoSave = setInterval(() => {
  //     if (mode === "create") {
  //       handleSave();
  //     }
  //   }, 1000 * 60);
  //   return () => clearInterval(autoSave);

  //   // eslint-disable-next-line
  // }, [watchValue.title, watchValue.content]);

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
        onImageUpload={(type: "featured" | "content") => {
          setImageModalType(type);
          setIsImageModalOpen(true);
        }}
      />

      {/* Settings dialog*/}
      <PostEditorSettings
        form={form}
        mode={mode}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingOpen(false)}
      />

      {/* image upload dialog */}
      <ImageUploadPopUp
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelect={handleImageSelect}
        title={
          imageModalType === "featured"
            ? "Upload Featured Image"
            : "Insert Image"
        }
      />
    </div>
  );
}

export default PostEditor;
