from pathlib import Path
from typing import List
from PIL import Image
from reportlab.lib.pagesizes import A4, landscape, portrait
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.units import mm
import tempfile, os

class PDFGenerator:
    def __init__(self, source_folder, output_pdf, image_quality=85, orientation='portrait', margin=10, scale=1.0):
        self.source_folder = Path(source_folder)
        self.output_pdf = output_pdf
        self.image_quality = image_quality
        self.orientation = orientation
        self.margin = margin  # in mm
        self.scale = scale
        self.page_size = landscape(A4) if orientation == 'landscape' else portrait(A4)

    def get_images(self) -> List[Path]:
        return sorted([
            f for f in self.source_folder.iterdir()
            if f.suffix.lower() in ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')
        ])

    def generate_pdf(self):
        images = self.get_images()
        if not images:
            return

        c = canvas.Canvas(str(self.output_pdf), pagesize=self.page_size)
        temp_files = []

        page_width, page_height = self.page_size
        margin_px = self.margin * mm

        for image_path in images:
            with Image.open(image_path) as img:
                if img.mode != "RGB":
                    img = img.convert("RGB")

                original_width, original_height = img.size

                # Apply scale
                scaled_width = int(original_width * self.scale)
                scaled_height = int(original_height * self.scale)
                img = img.resize((scaled_width, scaled_height), Image.Resampling.LANCZOS)

                # Calculate fitting box within margins
                ratio = min(
                    (page_width - 2 * margin_px) / scaled_width,
                    (page_height - 2 * margin_px) / scaled_height
                )
                new_width = scaled_width * ratio
                new_height = scaled_height * ratio
                x = (page_width - new_width) / 2
                y = (page_height - new_height) / 2

                with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
                    img.save(tmp.name, "JPEG", quality=self.image_quality, optimize=True)
                    img_reader = ImageReader(tmp.name)
                    c.drawImage(img_reader, x, y, width=new_width, height=new_height)
                    c.showPage()
                    temp_files.append(tmp.name)

        c.save()

        for tmp in temp_files:
            os.remove(tmp)
