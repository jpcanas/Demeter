import { ChangeEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import { RotateCcw, Trash2, Upload } from "lucide-react";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { UploadStatus } from "@/hooks/use-fileUploadHandler";

// one state variable and not using multiple useState
// type UploadStatus = "idle" | "uploading" | "success" | "error";
interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  status: UploadStatus;
  uploadProgress: number;
}

export default function FileUploader({
  file,
  setFile,
  status,
  uploadProgress,
}: FileUploaderProps) {
  // const [status, setStatus] = useState<UploadStatus>("idle");
  // const [uploadProgress, setUploadProgress] = useState(0);
  const [imgPreview, setImgPreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [dragActive, setDragActive] = useState(false);

  //======= on click file browse ==========
  function handleFileChanged(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      const filePrev = e.target.files[0];
      const fileReader = new FileReader();

      fileReader.onload = () => {
        setImgPreview(fileReader.result);
      };

      fileReader.readAsDataURL(filePrev);
    }
  }

  // ===== Handle drag events (on drag files) =========
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
      const filePrevDrag = droppedFiles[0];
      const fileReaderDrag = new FileReader();

      fileReaderDrag.onload = () => {
        setImgPreview(fileReaderDrag.result);
      };

      fileReaderDrag.readAsDataURL(filePrevDrag);
    }
  };

  const fileUploadInput = useRef<HTMLInputElement>(null);
  const { setNodeRef } = useDroppable({
    id: "dropzone",
  });

  // useEffect(() => {
  //   if(status ){
  //     setImgPreview(null);
  //     //setStatus("idle");
  //   }
  // },[])
  const removeCurrentUpload = () => {
    // setImgPreview(null);
    // setFile(null);
    // setStatus("idle");
    // setUploadProgress(0);
  };

  return (
    <div className="space-y-4 ">
      <input
        className="hidden"
        type="file"
        onChange={handleFileChanged}
        ref={fileUploadInput}
      />
      <div className="border-2 border-slate-300 h-fit rounded-md">
        <DndContext>
          {status == "idle" && file == null && (
            <div
              className={`p-5 cursor-pointer ${
                dragActive ? "border-2 rounded-md border-primary" : ""
              }`}
              id="draggableArea"
              ref={setNodeRef}
              onClick={() => fileUploadInput.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col text-center">
                <Upload className="text-slate-400 mb-3 w-full" />
                <h1 className="text-lg text-slate-400">
                  Click here to upload your file or drag and drop
                </h1>
                <p className="text-slate-400">
                  File supported .jpg .png .gif .webp (5MB max)
                </p>
              </div>
            </div>
          )}
          <div
            className={`${file != null ? "m-4" : undefined}`}
            id="resultArea"
          >
            <UploadPreview
              file={file}
              status={status}
              imgPreview={imgPreview}
              uploadProgress={uploadProgress}
              removeCurrentUpload={removeCurrentUpload}
            />
          </div>
        </DndContext>
      </div>

      {/* {file && status !== "uploading" && (
        <Button onClick={handleFileUpload}>Upload</Button>
      )} */}
    </div>
  );
}

interface imgPreviewProps {
  file: File | null;
  status: UploadStatus;
  imgPreview: string | ArrayBuffer | null;
  uploadProgress: number;
  removeCurrentUpload: () => void;
}

function UploadPreview({
  file,
  status,
  imgPreview,
  uploadProgress,
  removeCurrentUpload,
}: imgPreviewProps) {
  return (
    <>
      {file && (
        <div className="flex flex-row flex-wrap">
          <div className="flex-none rounded-md shadow-xl">
            <img
              src={typeof imgPreview === "string" ? imgPreview : undefined}
              width={200}
              height={200}
              alt="sample image"
              className="max-h-[7em] object-contain"
            />
          </div>

          <div className="text-sm flex-1 mx-4">
            <p className="text-base">{file.name}</p>
            <p className="text-slate-600">{(file.size / 1024).toFixed(2)} Kb</p>
            <p className="text-slate-600">{file.type}</p>

            {status === "idle" && file != null && (
              <p className="text-sm text-orange-400 mt-2">Ready to Upload</p>
            )}

            {status === "uploading" && (
              <div className="space-y-2 mt-2">
                <div className="h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            {status === "success" && (
              <p className="text-sm text-green-500 mt-2">
                File uploaded successfully!
              </p>
            )}

            {status === "error" && (
              <p className="text-sm text-destructive">
                Upload failed. Please try again.
              </p>
            )}
          </div>

          <div className="flex-none">
            {status == "error" && (
              <Button variant="ghost" size="icon">
                <RotateCcw className="cursor-pointer" size="18" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={removeCurrentUpload}>
              <Trash2 className="cursor-pointer" size="18" color="#FF6969" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
