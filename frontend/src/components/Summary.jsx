import { useState } from "react";
import API from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Summary({ documentId }) {
  const [summary, setSummary] = useState("");

  const getSummary = async () => {
    if (!documentId) {
      return alert("Please upload a document first.");
    }

    const res = await API.post("/summary/", {
      document_id: documentId,
    });

    setSummary(res.data.summary);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button onClick={getSummary}>Generate</Button>

        <div className="bg-gray-800 p-3 rounded min-h-[80px]">{summary}</div>
      </CardContent>
    </Card>
  );
}
