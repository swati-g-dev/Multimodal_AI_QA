import { useState } from "react";
import Upload from "./components/Upload";
import Chat from "./components/Chat";
import Summary from "./components/Summary";
import VideoPlayer from "./components/VideoPlayer";

export default function App() {
  const [documentId, setDocumentId] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI Document & Media Q&A
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Upload setDocumentId={setDocumentId} />
        {/* check how it looks and whether is good to have i tor avoid */}
        {/* {documentId && (
          <div className="bg-green-900 p-3 rounded">
            Active Document ID: {documentId}
          </div>
        )} */}
        <Chat documentId={documentId} />

        <Summary documentId={documentId} />

        <VideoPlayer documentId={documentId} />
      </div>
    </div>
  );
}
