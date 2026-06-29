import { useEffect, useRef, useState } from "react";
import API from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

export default function VideoPlayer({ document_id, activeTimestamp }) {
  const videoRef = useRef();
  const [query, setQuery] = useState("");
  // For production tracking, point directly to a static mount or a placeholder local test stream
  const [videoUrl, setVideoUrl] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  );

  // Utility to convert timestamps like "00:01:23" into raw seconds
  const parseTimestampToSeconds = (timestampStr) => {
    if (!timestampStr) return 0;
    const parts = timestampStr.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return Number(timestampStr) || 0;
  };

  useEffect(() => {
    if (activeTimestamp && videoRef.current) {
      const targetSeconds = parseTimestampToSeconds(activeTimestamp);
      videoRef.current.currentTime = targetSeconds;
      videoRef.current
        .play()
        .catch(() => console.log("Auto-play blocked by user settings"));
    }
  }, [activeTimestamp]);

  return (
    <Card className="bg-zinc-900/60 border-zinc-800 overflow-hidden">
      <CardHeader className="py-4 border-b border-zinc-800/60">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Video className="h-5 w-5 text-green-400" /> Synchronized Media Player
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col items-center">
        <video
          ref={videoRef}
          controls
          className="w-full aspect-video rounded-lg shadow-xl bg-black border border-zinc-800"
        >
          <source src={videoUrl} type="video/video" />
          Your browser does not support video playback elements.
        </video>
        {activeTimestamp && (
          <div className="mt-3 text-xs text-zinc-400">
            Currently synchronized track pointer location:{" "}
            <span className="text-green-400 font-mono font-bold">
              {activeTimestamp}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}