import {
  FileAudio,
  FileIcon,
  FileImage,
  FileText,
  FileVideo,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";

type FileWithProgress = {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
};

export default function FileUploadMultiple() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) {
      return;
    }

    const newFiles = Array.from(e.target.files).map((file) => {
      return {
        file,
        progress: 0,
        uploaded: false,
        id: file.name,
      };
    });

    setFiles([...files, ...newFiles]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (files.length === 0 || uploading) {
      return;
    }

    setUploading(true);

    const uploadPromises = files.map(async (fileWithProgress) => {
      const formData = new FormData();
      formData.append("file", fileWithProgress.file);

      try {
        await axios.post("https://httpbin.org/post", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setFiles((prevFiles) =>
              prevFiles.map((file) =>
                file.id === fileWithProgress.id ? { ...file, progress } : file
              )
            );
          },
        });

        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileWithProgress.id ? { ...file, uploaded: true } : file
          )
        );
      } catch (error) {
        console.error(error);
      }
    });

    await Promise.all(uploadPromises);
    setUploading(false);
  }

  function removeFile(id: string) {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">File Upload</h2>
      <div className="flex gap-2">
        <FileInput
          inputRef={inputRef}
          disabled={uploading}
          onFileSelect={handleFileSelect}
        />
        <ActionButtons
          disabled={files.length === 0 || uploading}
          onUpload={handleUpload}
          onClear={() => setFiles([])}
        />
      </div>
      <FileList files={files} onRemove={removeFile} uploading={uploading} />
    </div>
  );
}

type FileInputProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  disabled: boolean;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
};

function FileInput({ inputRef, disabled, onFileSelect }: FileInputProps) {
  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={onFileSelect}
        multiple
        className="hidden"
        id="file-upload"
        disabled={disabled}
      />
      <label
        htmlFor="file-upload"
        className="flex cursor-pointer items-center gap-2 bg-slate-100 rounded-md border-2 border-primary px-6 py-2 hover:bg-slate-300"
      >
        <Plus size={18} />
        Select Files
      </label>
    </>
  );
}

type ActionButtonProps = {
  disabled: boolean;
  onUpload: () => void;
  onClear: () => void;
};

function ActionButtons({ disabled, onUpload, onClear }: ActionButtonProps) {
  return (
    <>
      <Button
        onClick={onUpload}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Upload size={18} />
        Upload
      </Button>
      <Button
        onClick={onClear}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Trash2 size={18} />
        Clear All
      </Button>
    </>
  );
}

type FileListProps = {
  files: FileWithProgress[];
  onRemove: (id: string) => void;
  uploading: boolean;
};

function FileList({ files, onRemove, uploading }: FileListProps) {
  if (files.length === 0) {
    return;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Files:</h3>
      <div className="space-y-2">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemove}
            uploading={uploading}
          />
        ))}
      </div>
    </div>
  );
}

type FileItemProps = {
  file: FileWithProgress;
  onRemove: (id: string) => void;
  uploading: boolean;
};

function FileItem({ file, onRemove, uploading }: FileItemProps) {
  const Icon = getFileIcon(file.file.type);

  return (
    <div className="space-y-2 rounded-md p-4 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Icon size={36} className="text-primary" />
          <div className="flex flex-col">
            <span className="font-medium">{file.file.name}</span>
            <div className="flex items-center gap-2 text-xs text-secondary">
              <span>{formatFileSize(file.file.size)}</span>
              <span>.</span>
              <span>{file.file.type || "Unknown type"}</span>
            </div>
          </div>
        </div>
        {!uploading && (
          <button onClick={() => onRemove(file.id)} className="bg-none p-0">
            <X size={16} className="text-primary" />
          </button>
        )}
      </div>
      <div className="text-right text-xs">
        {file.uploaded ? "Completed" : `${Math.round(file.progress)}%`}
      </div>
      <ProgressBar progress={file.progress} />
    </div>
  );
}

type ProgressBarProps = {
  progress: number;
};

function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

// Helper functions
const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.startsWith("video/")) return FileVideo;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType.startsWith("text/")) return FileText;
  return FileIcon;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const fileSizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${fileSizes[i]}`;
};
