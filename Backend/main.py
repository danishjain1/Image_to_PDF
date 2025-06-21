from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import uuid, shutil
from utils.pdf_generator import PDFGenerator

app = FastAPI()

# Allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
RESULT_DIR = Path("results")
UPLOAD_DIR.mkdir(exist_ok=True)
RESULT_DIR.mkdir(exist_ok=True)

@app.post("/upload")
async def upload(files: list[UploadFile] = File(...)):
    task_id = str(uuid.uuid4())
    folder = UPLOAD_DIR / task_id
    folder.mkdir()
    for file in files:
        file_path = folder / file.filename
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    return {"task_id": task_id}

@app.post("/generate-pdf")
def generate_pdf(
    task_id: str = Form(...),
    quality: int = Form(85),
    orientation: str = Form('portrait'),
    margin: int = Form(10),
    scale: float = Form(1.0),
    order: list[str] = Form(None)
):
    folder = UPLOAD_DIR / task_id
    output = RESULT_DIR / f"{task_id}.pdf"

    # Reorder images if custom order is provided
    if order:
        ordered_images = []
        for name in order:
            src = folder / name
            if src.exists():
                ordered_images.append(src)
        for i, img in enumerate(ordered_images):
            img.rename(folder / f"{i:03d}_{img.name}")

    pdfgen = PDFGenerator(
        source_folder=str(folder),
        output_pdf=str(output),
        image_quality=quality,
        orientation=orientation,
        margin=margin,
        scale=scale
    )
    pdfgen.generate_pdf()
    return {"download_url": f"/download/{task_id}"}


@app.get("/download/{task_id}")
def download_pdf(task_id: str):
    file_path = RESULT_DIR / f"{task_id}.pdf"
    if not file_path.exists():
        return JSONResponse(status_code=404, content={"error": "File not found"})
    return FileResponse(path=file_path, filename=f"{task_id}.pdf", media_type='application/pdf')


    

# @app.post("/generate-pdf")
# def generate_pdf(task_id: str = Form(...), quality: int = Form(85)):
#     folder = UPLOAD_DIR / task_id
#     output_path = RESULT_DIR / f"{task_id}.pdf"
#     if not folder.exists():
#         return JSONResponse(status_code=404, content={"error": "Files not found."})

#     pdfgen = PDFGenerator(source_folder=str(folder), output_pdf=str(output_path), image_quality=quality)
#     pdfgen.generate_pdf()

#     return {"download_url": f"/download/{task_id}"}

# @app.get("/download/{task_id}")
# def download(task_id: str):
#     pdf_file = RESULT_DIR / f"{task_id}.pdf"
#     if pdf_file.exists():
#         return FileResponse(pdf_file, filename=f"{task_id}.pdf")
#     return JSONResponse(status_code=404, content={"error": "PDF not found."})
