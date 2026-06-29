import { useState } from "react";
import API from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Film, Loader2 } from "lucide-react";

export default function Upload({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");

  const processFile = async (file) => {
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const responseData = res.data.data ? res.data.data : res.data;

      const uploadedId = responseData.document_id;
      const fileType = responseData.file_type;

      if (!uploadedId) {
        throw new Error("Invalid server response envelope format.");
      }

      // Pass details upstream to master container
      onUploadSuccess({
        id: uploadedId,
        filename: file.name,
        type: fileType === "pdf" ? "pdf" : "media",
      });
    } catch (err) {
      console.error("Upload error sequence detailed trace:", err);
      alert(
        `Upload failed: ${err.response?.data?.detail || err.message || "Internal extraction error."}`,
      );
      setFileName("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`border-2 border-dashed transition-all duration-200 ${
        dragActive
          ? "border-blue-500 bg-blue-500/5"
          : "border-zinc-800 bg-zinc-900/40"
      }`}
    >
      <CardContent
        className="pt-6 flex flex-col items-center justify-center min-h-[220px] cursor-pointer"
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          processFile(e.dataTransfer.files[0]);
        }}
      >
        {loading ? (
          <div className="flex flex-col items-center animate-in fade-in">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-sm font-medium text-zinc-300">
            {/* <p className="text-xs text-zinc-500 mt-1 max-w-xs text-center px-4 truncate"> */}
              Processing media assets...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <UploadCloud className="h-12 w-12 text-zinc-500 mb-3" />
            <p className="text-sm font-medium text-zinc-300">
              Drag & drop or browse files
            </p>
            <p className="text-xs text-zinc-500 mt-1 mb-5">
              Supports PDF, MP3, WAV, MP4, MOV
            </p>

            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.mp3,.mp4,.wav,.mov"
              onChange={(e) => processFile(e.target.files?.[0])}
              disabled={loading}
            />

            <Button
              asChild
              variant="secondary"
              className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 h-9 px-4"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                Select File
              </label>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}