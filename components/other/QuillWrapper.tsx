import { forwardRef } from "react";
import ReactQuill from "react-quill-new";

export type CustomQuillProps = React.ComponentProps<typeof ReactQuill>;

const QuillWrapper = forwardRef<ReactQuill, CustomQuillProps>((props, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

QuillWrapper.displayName = "QuillWrapper";

export default QuillWrapper;
