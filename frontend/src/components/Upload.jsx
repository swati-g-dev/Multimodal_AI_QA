import API from "../api/api";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Upload({ setDocumentId }) {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return alert("Please select a file to upload.");
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedId = res.data.data.document_id;

      setDocumentId(uploadedId);

      alert("Upload successful!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <Button className="w-full" onClick={handleUpload}>
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}
