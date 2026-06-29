import React, { useState } from "react";
import Upload from "./components/Upload";
import Chat from "./components/Chat";
import Summary from "./components/Summary";
import VideoPlayer from "./components/VideoPlayer";
import { FileText, Film, RefreshCw } from "lucide-react";

export default function App() {
  const [activeAsset, setActiveAsset] = useState(null); // Shape: { id, filename, type }
  const [targetTimestamp, setTargetTimestamp] = useState("");

  const isPdf = activeAsset?.type === "pdf";

  return (
    /* CRITICAL FIX HERE: 
      Changed 'h-screen overflow-hidden' to 'min-h-screen overflow-y-auto'.
      This allows the entire webpage to scroll naturally if cards or videos run out of room.
    */
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white font-sans antialiased overflow-y-auto selection:bg-blue-600/30">
      {/* Sticky Header Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur px-8 py-4 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center tracking-wider text-sm shadow-md shadow-blue-600/20">
            <img
              src="logo.png"
              alt=""
              className="h-full w-full object-contain"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Omni Context
          </h1>
        </div>
        {activeAsset && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 font-medium">
            {isPdf ? (
              <FileText size={14} className="text-blue-400" />
            ) : (
              <Film size={14} className="text-green-400" />
            )}
            <span className="truncate max-w-[200px] text-zinc-200">
              {activeAsset.filename}
            </span>
          </div>
        )}
      </header>

      {/* Main Workspace Body Content Wrapper */}
      {/* Removed 'lg:overflow-hidden' from this div to prevent grid truncation */}
      <div className="flex-1 p-6">
        {!activeAsset ? (
          <div className="max-w-2xl mx-auto mt-20 space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Search, summarize, and converse with your content
              </h2>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">
                A Retrieval-Augmented AI system enabling question answering
                and summarization across your documents,
                {/* summarization, and timestamp-based navigation across documents, */}
                audio, and video content
              </p>
            </div>
            <Upload onUploadSuccess={(asset) => setActiveAsset(asset)} />
          </div>
        ) : (
          /* CRITICAL FIX HERE: 
            Removed 'h-full' and 'overflow-hidden' from the workspace stack.
            This lets the interior sub-layout components flow and expand naturally.
          */
          <div className="flex flex-col space-y-4 max-w-7xl mx-auto animate-in fade-in duration-300">
            {/* Control Ribbon */}
            <div className="flex items-center justify-end shrink-0">
              <button
                onClick={() => {
                  setActiveAsset(null);
                  setTargetTimestamp("");
                }}
                className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded border border-zinc-800"
              >
                <RefreshCw size={12} />
                Reupload another file
              </button>
            </div>

              

              {/* for now, keep videoplayer and timestamp feature for future */}
            <div
              className="grid grid-cols-1 pb-4 gap-6 items-start max-w-4xl w-full mx-auto">
              {/* Context Action Panel Column (Chat Component + Summary Component) */}
              <div
                className="flex flex-col space-y-6 col-span-1"
              >
                {/* Instead of trying to freeze internal container elements, 
                  we give them specific structural heights here so they layout nicely on the page.
                */}
                <div className="h-[450px]">
                  <Chat
                    documentId={activeAsset.id}
                    onTimestampTrigger={(ts) => setTargetTimestamp(ts)}
                  />
                </div>
                <div className="h-[250px]">
                  <Summary documentId={activeAsset.id} />
                </div>
              </div> 

            {/* Dynamic Dashboard Grid 
                - If file is PDF: centered column view.
                - If file is Media: explicit 12-column side-by-side grid container.
            */}
            {/* <div
              className={`grid grid-cols-1 pb-4 gap-6 items-start ${
                isPdf
                  ? "max-w-4xl w-full mx-auto grid-cols-1"
                  : "lg:grid-cols-12"
              }`}
            >
              // { Context Action Panel Column (Chat Component + Summary Component) }
              <div
                className={`flex flex-col space-y-6 ${
                  isPdf ? "col-span-1" : "lg:col-span-7"
                }`}
              >
                // { Instead of trying to freeze internal container elements, 
                //   we give them specific structural heights here so they layout nicely on the page.
                // }
                <div className="h-[450px]">
                  <Chat
                    documentId={activeAsset.id}
                    onTimestampTrigger={(ts) => setTargetTimestamp(ts)}
                  />
                </div>
                <div className="h-[250px]">
                  <Summary documentId={activeAsset.id} />
                </div>
              </div> */}

              {/* Dynamic Video Player Section */}
              {/* {!isPdf && (
                <div className="lg:col-span-5 animate-in slide-in-from-right duration-300 sticky top-24">
                  <VideoPlayer
                    documentId={activeAsset.id}
                    activeTimestamp={targetTimestamp}
                  />
                </div>
              )} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
