import FileUploader from "@/components/fileUploader";
import FileUploadMultiple from "@/components/fileUploaderMultiple";
import { Button } from "@/components/ui/button";
import { useFileUploadHandler } from "@/hooks/use-fileUploadHandler";
import { useState } from "react";

export default function FileUploaderPage() {
  const [file, setFile] = useState<File | null>(null);
  const { handleFileUpload, status, uploadProgress } = useFileUploadHandler();

  const uploadURL = "https://httpbin.org/post";

  return (
    <>
      <h1>File uploader</h1>
      <div className="w-1/2 p-6">
        <FileUploader
          file={file}
          setFile={setFile}
          status={status}
          uploadProgress={uploadProgress}
        />
        <div>
          <Button
            className={`px-4 py-2 mt-4 ${
              status === "uploading" ? "bg-slate-400" : "bg-primary"
            }`}
            disabled={status === "uploading"}
            onClick={() => handleFileUpload(file, uploadURL)}
          >
            Upload
          </Button>
        </div>
      </div>
      <h1>File uploader Multiple files</h1>
      <div className="w-1/2 p-6">
        <FileUploadMultiple />
      </div>
    </>
  );
}
