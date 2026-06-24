import { useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [timestamp, setTimestamp] = useState("00:00");
  const [videoUrl, setVideoUrl] = useState(""); // For demo, use public URL or uploaded blob

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await axios.post("http://localhost:8000/documents/upload", formData);
    setFiles([...files, res.data]);
  };

  const askQuestion = async () => {
    if (!selectedDoc) return;
    const res = await axios.post("http://localhost:8000/chat/", {
      document_id: selectedDoc,
      question
    });
    setAnswer(res.data.answer);
    setTimestamp(res.data.timestamp || "00:01:23");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">DocQA AI - Documents &amp; Multimedia</h1>
      
      <input type="file" onChange={handleUpload} className="mb-8" accept=".pdf,.mp3,.mp4,.wav" />
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2>Uploaded Documents</h2>
          {files.map(f => (
            <button key={f.id} onClick={() => setSelectedDoc(f.id)} className="block p-4 bg-zinc-900 my-2 w-full text-left">
              {f.filename}
            </button>
          ))}
        </div>

        <div>
          <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask a question..." className="w-full p-4 bg-zinc-900" />
          <button onClick={askQuestion} className="mt-4 bg-blue-600 px-8 py-3">Ask</button>
          
          {answer && <div className="mt-8 p-6 bg-zinc-900 rounded-xl">{answer}</div>}
          
          {timestamp && (
            <button 
              onClick={() => {/* seek video player to timestamp */ alert(`Jump to ${timestamp}`)}}
              className="mt-4 bg-green-600 px-6 py-2"
            >
              ▶ Play from {timestamp}
            </button>
          )}
        </div>
      </div>

      {/* Video Player Demo */}
      <ReactPlayer url={videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} controls />
    </div>
  );
}

export default App;