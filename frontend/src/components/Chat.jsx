import React, { useState, useRef, useEffect } from "react";
import API from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Play, Loader2 } from "lucide-react";

export default function Chat({ documentId, onTimestampTrigger }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Automatically scroll down when a long answer arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const ask = async () => {
    if (!query.trim() || loading) return;

    const userQuery = query;
    setQuery("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", text: userQuery }]);

    try {
      const res = await API.post("/chat/", {
        query: userQuery,
        document_id: documentId,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: res.data.answer,
          timestamp: res.data.timestamp,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error communicating with backend service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col bg-zinc-900/60 border-zinc-800 overflow-hidden">
      <CardHeader className="border-b border-zinc-800/60 py-3 shrink-0">
        <CardTitle className="text-lg text-white font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" /> Conversational AI Agent
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-4 overflow-hidden justify-between">
        {/* Scroll-Isolated Message Viewport */}
        <ScrollArea className="flex-1 pr-3 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center text-zinc-500 mt-20 text-xs">
              Ask a relevant question about your file to get started... 
            </div>
          )}

          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role !== "user" && (
                  <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-blue-400 shrink-0">
                    <Bot size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white font-medium rounded-tr-none"
                      : "bg-zinc-800 text-zinc-200 border border-zinc-700/60 rounded-tl-none"
                  }`}
                >
                  <p>{m.text}</p>

                  {m.timestamp && onTimestampTrigger && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-2 text-xs gap-1 bg-zinc-700 hover:bg-zinc-600 text-white border-none h-6 px-2"
                      onClick={() => onTimestampTrigger(m.timestamp)}
                    >
                      <Play size={10} fill="white" /> Jump to {m.timestamp}
                    </Button>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="h-7 w-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-blue-400">
                  <Loader2 size={14} className="animate-spin" />
                </div>
                <div className="bg-zinc-800 text-zinc-500 border border-zinc-700/60 rounded-xl rounded-tl-none px-3.5 py-2 text-xs animate-pulse">
                  AI Agent is reading relevant context chunks...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Static Form Row: Form stays fixed to the base of the card */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800/80 shrink-0">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="Type your next query here..."
            className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-blue-500 placeholder:text-zinc-600 text-sm h-9"
            disabled={loading}
          />
          <Button
            onClick={ask}
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 shrink-0 h-9 px-3"
            disabled={loading}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
