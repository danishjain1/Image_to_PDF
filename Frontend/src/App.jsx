import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Compress from "./pages/Compress";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compress" element={<Compress />} />
      </Routes>
    </BrowserRouter>
  );
}




// import React, { useState } from 'react';

// export default function App() {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);

//   const handleUpload = async () => {
//     const formData = new FormData();
//     files.forEach(file => formData.append("files", file));
//     setLoading(true);
//     const res = await fetch("http://localhost:8000/upload", { method: "POST", body: formData });
//     const { folder_id } = await res.json();
//     const pdfRes = await fetch(`http://localhost:8000/generate-pdf/${folder_id}`);
//     const blob = await pdfRes.blob();
//     const url = window.URL.createObjectURL(blob);
//     setPdfUrl(url);
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-4xl font-bold text-center mb-6">iLovePDF Clone: JPG to PDF</h1>
//       <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md text-center">
//         <input type="file" multiple accept="image/*" onChange={(e) => setFiles([...e.target.files])} className="mb-4" />
//         <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
//           {loading ? "Processing..." : "Upload & Convert"}
//         </button>
//         {pdfUrl && (
//           <div className="mt-4">
//             <a href={pdfUrl} download="converted.pdf" className="text-blue-600 underline">Download PDF</a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }