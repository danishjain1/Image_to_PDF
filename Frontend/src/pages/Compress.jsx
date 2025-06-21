import React, { useState } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function Compress() {
  const [files, setFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState('portrait');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

const handleGenerate = async () => {
  if (files.length === 0) return;
  setLoading(true);

  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  const uploadRes = await axios.post('http://localhost:8000/upload', formData);
  const { task_id } = uploadRes.data;

  const generateForm = new FormData();
  generateForm.append('task_id', task_id);
  generateForm.append('quality', 85);
  generateForm.append('orientation', orientation);
  generateForm.append('margin', 10);
  generateForm.append('scale', 1.0);

  files.forEach(file => generateForm.append('order', file.name)); // order support

  const genRes = await axios.post('http://localhost:8000/generate-pdf', generateForm);
  const downloadUrl = `http://localhost:8000${genRes.data.download_url}`;
  setPdfUrl(downloadUrl);
  setLoading(false);
};



  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Compress PDF</h1>
      <div className="mb-4 space-y-2">
        <input type="file" multiple onChange={handleFileChange} className="mb-2" />
        <div>
          <label className="mr-2">Page Orientation:</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            className="text-black px-2 py-1 rounded"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        <button
          onClick={handleGenerate}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Generate PDF
        </button>
      </div>

      {loading && <p className="text-yellow-300">Generating PDF...</p>}

      {pdfUrl && (
        <div className="mt-6">
          <p>
            Done!{' '}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              Download PDF
            </a>
          </p>
          <div className="mt-4 border border-gray-700 rounded shadow">
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
              <Viewer fileUrl={pdfUrl} />
            </Worker>
          </div>
        </div>
      )}
    </div>
  );
}



// import React, { useState } from "react";
// import axios from "axios";

// export default function Compress() {
//   const [files, setFiles] = useState([]);
//   const [progress, setProgress] = useState(null);
//   const [downloadUrl, setDownloadUrl] = useState(null);

//   const uploadAndCompress = async () => {
//     const formData = new FormData();
//     for (const file of files) {
//       formData.append("files", file);
//     }

//     setProgress("Uploading...");

//     const uploadRes = await axios.post("http://localhost:8000/upload", formData);
//     const taskId = uploadRes.data.task_id;

//     setProgress("Processing PDF...");

//     const result = await axios.post("http://localhost:8000/generate-pdf", new URLSearchParams({
//       task_id: taskId,
//       quality: "80"
//     }));

//     setDownloadUrl(`http://localhost:8000${result.data.download_url}`);
//     setProgress("Done!");
//   };

//   return (
//     <div className="p-6 text-white">
//       <h2 className="text-2xl font-bold mb-4">Compress PDF</h2>
//       <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
//       <button
//         className="bg-blue-600 mt-4 px-4 py-2 rounded"
//         onClick={uploadAndCompress}
//       >
//         Generate PDF
//       </button>

//       {progress && <p className="mt-4">{progress}</p>}
//       {downloadUrl && (
//         <a href={downloadUrl} className="text-blue-300 underline" download>
//           Download PDF
//         </a>
//       )}
//     </div>
//   );
// }
