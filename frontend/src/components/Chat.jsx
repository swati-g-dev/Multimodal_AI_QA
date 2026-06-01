import { useState } from "react";
import API from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Chat({ documentId }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  const ask = async () => {
    if (!documentId) {
      return alert("Please upload a document first.");
    }

    const res = await API.post("/chat/", {
      query,
      document_id: documentId,
    });

    setMessages((prev) => [
      ...messages,
      { role: "user", text: query },
      { role: "bot", text: res.data.answer },
    ]);

    // check which is better
    // setMessages((prev) => [
    //   ...prev,
    //   { role: "user", text: query },
    //   { role: "bot", text: res.data.answer },
    // ]);


    setQuery("");
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex-1 mb-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 my-1 rounded ${
                m.role === "user" ? "bg-blue-600 text-right" : "bg-gray-700"
              }`}
            >
              {m.text}
            </div>
          ))}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something..."
          />
          <Button onClick={ask}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
