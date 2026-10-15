import os
import uuid
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/svg+xml"}

async def save_uploaded_image(file: UploadFile) -> str:
    # Validate extension
    filename = file.filename or "uploaded_image"
    _, ext = os.path.splitext(filename)
    ext = ext.lower()
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension: '{ext}'. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Validate content type
    if file.content_type and file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type: '{file.content_type}'. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}"
        )
    
    # Read and check size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024*1024)}MB"
        )
    
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Generate unique safe name
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    with open(dest_path, "wb") as f:
        f.write(content)
        
    return f"/uploads/{unique_filename}"
