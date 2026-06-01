import { useRef, useState } from "react";
import API from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VideoPlayer({document_id}) {
  const videoRef = useRef();
  const [query, setQuery] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const findTimestamp = async () => {
    if (!document_id || !query) {
      return alert("Please enter both Document ID and query.");
    }

    const res = await API.post("/timestamp/", {
      document_id: document_id,
      query,
    });

    if (videoRef.current) {
      videoRef.current.currentTime = res.data.start;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video QA</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <Input
          value={videoUrl}
          placeholder="Video URL"
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <Input
          value={query}
          placeholder="Query"
          onChange={(e) => setQuery(e.target.value)}
        />

        <video ref={videoRef} controls className="w-full rounded">
          <source src={videoUrl} />
        </video>

        <Button onClick={findTimestamp}>Jump to Relevant Segment</Button>
      </CardContent>
    </Card>
  );
}
