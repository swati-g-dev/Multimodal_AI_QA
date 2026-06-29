import { useState } from "react";
import API from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText } from "lucide-react";

export default function Summary({ documentId }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const getSummary = async () => {
    setLoading(true);
    try {
      const res = await API.post("/summary/", { document_id: documentId });
      setSummary(res.data.summary);
    } catch (err) {
      alert("Failed to compile summary layers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 border-b border-zinc-800/60">
        <CardTitle className="text-lg text-white font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-400" /> 
          Document Summary
        </CardTitle>
        {!summary && (
          <Button
            size="sm"
            onClick={getSummary}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 text-white gap-1.5 text-xs h-8"
          >
            <Sparkles size={14} />{" "}
            {loading ? "Synthesizing..." : "Generate Summary"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {summary ? (
          <div className="text-sm text-zinc-300 leading-relaxed max-h-[400px] overflow-y-auto whitespace-pre-wrap pr-2">
            {summary}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-zinc-500 italic">
            No summary generated yet. Click "Generate Summary" to create one.
          </div>
        )}
      </CardContent>
    </Card>
  );
}