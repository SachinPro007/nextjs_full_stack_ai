import React from "react";
import { PostFormData } from "./PostContentEditor";
import { FieldErrors } from "react-hook-form";

// types
interface EditorSettingsFnArgs {
  isOpen: boolean;
  onClose: () => void;
  form: {
    register: (name: keyof PostFormData, options?: object) => object;
    watch: () => PostFormData;
    setValue: (
      name: keyof PostFormData,
      value: PostFormData[keyof PostFormData],
      options?: object,
    ) => void;
    formState: { errors: FieldErrors };
  };
  mode: string;
}

function PostEditorSettings({
  isOpen,
  onClose,
  form,
  mode,
}: EditorSettingsFnArgs) {
  return <div>PostEditorSettings</div>;
}

export default PostEditorSettings;
