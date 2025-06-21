# 🧾 DJ PDF Maker

DJ PDF Maker is a web-based PDF tool inspired by iLovePDF. It provides tools like compressing, merging, and converting images to PDF, all running on a React + Tailwind frontend with a FastAPI backend.

---

## 🌟 Features

- 📥 Upload from device (Google Drive / Dropbox integrations coming soon)
- 🔧 Tools: Compress PDF, Merge PDFs, Convert Images to PDF
- 🌘 Dark mode UI with TailwindCSS
- ⏳ Live progress feedback (uploading → processing → download)
- 📦 Fast and lightweight backend using FastAPI and Pillow
- 🎯 Public access — no login required

---

## 📁 Project Structure

```
DJ_PDF_Maker/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── utils/
│       └── pdf_generator.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.js
│   │   ├── pages/
│   │   ├── data/
│   │   └── styles/
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

---

## 🚀 Getting Started

### 🔧 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

✅ The backend will run at: [http://localhost:8000](http://localhost:8000)

---

### 🎨 2. Frontend Setup (React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

✅ The frontend will run at: [http://localhost:5173](http://localhost:5173)

---

## 🔗 API Endpoints

### Upload Images
`POST /upload`

```json
FormData: files[]
```

Returns:
```json
{
  "task_id": "xxxx-xxxx-xxxx"
}
```

---

### Generate PDF
`POST /generate-pdf`

```form
task_id: string
quality: int (default 85)
```

Returns:
```json
{
  "download_url": "/download/<task_id>"
}
```

---

### Download PDF
`GET /download/<task_id>`

---

## ✅ TODO

- [ ] Add Google Drive and Dropbox API integrations
- [ ] Add Merge PDF and Split PDF tool
- [ ] Add OCR capability for scanned documents
- [ ] Add progress bar with percentage instead of text feedback

---

## 📸 Screenshots

_(Include screenshots here if you'd like)_

---

## ⚖ License

MIT — free to use, modify, and deploy.
