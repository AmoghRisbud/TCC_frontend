# File Upload Feature Guide

## Overview

The admin interface now supports direct file uploads (images and PDFs) for content management. This eliminates the need to manually manage files and paths.

## Supported Sections

### Image Upload
Available in the following admin sections:

1. **Announcements** - Announcement images
2. **Programs** - Program logos
3. **Research** - Research article images/thumbnails
4. **Gallery** - Gallery item images
5. **Testimonials** - Profile photos

### PDF Upload
Available in:

1. **Research** - Research article PDF documents

## How It Works

### Image Upload Component Features

- **Drag & Drop Support**: Upload component with file picker
- **Image Preview**: Instant preview before upload
- **Validation**:
  - File types: JPEG, JPG, PNG, GIF, WebP
  - Max size: 5MB
  - Automatic validation with error messages
- **Manual URL Entry**: Fallback option to enter image URLs manually
- **Remove Image**: One-click image removal

### PDF Upload Component Features

- **File Picker**: Select PDF files from your computer
- **PDF Info Display**: Shows filename and view link after upload
- **Validation**:
  - File type: PDF only
  - Max size: 10MB
  - Automatic validation with error messages
- **Manual URL Entry**: Fallback option to enter PDF URLs manually
- **Remove PDF**: One-click PDF removal

### Storage Location

**Images** are automatically saved to:
```
public/images/{category}/
```

Where `{category}` is one of:
- `announcements`
- `programs`
- `research`
- `gallery`
- `testimonials`

**PDFs** are automatically saved to:
```
public/research/
```

### File Naming

**Images**: Automatically renamed with:
- Timestamp (milliseconds)
- Random string (7 characters)
- Original file extension

Example: `1704067200000-abc1234.jpg`

**PDFs**: Automatically renamed with:
- Timestamp (milliseconds)
- Sanitized original filename

Example: `1704067200000-research_paper.pdf`

This prevents naming conflicts and ensures unique filenames.

## Usage Instructions

### For Admins

1. **Adding New Content with Image**:
   - Click "Add [Content Type]" button
   - Fill in required fields
   - In the image section, click "Upload Image"
   - Select image file from your computer
   - Image preview appears immediately
   - Continue filling other fields
   - Submit the form

2. **Editing Existing Content Image**:
   - Click "Edit" on any content item
   - Find the image section
   - Click "Change Image" to replace
   - Or click "×" on preview to remove image
   - Submit to save changes

3. **Manual URL Entry** (Alternative):
   - Expand "Or enter image URL manually" section
   - Enter the full path (e.g., `/images/programs/logo.png`)
   - Image will be validated and displayed

### API Endpoint

**POST** `/api/admin/upload`

**Request**: `multipart/form-data`
- `file`: Image file (required)
- `category`: Content category (required)

**Response**:
```json
{
  "success": true,
  "url": "/images/programs/1704067200000-abc1234.jpg",
  "message": "File uploaded successfully"
}
```

**Error Response**:
```json
{
  "error": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
}
```

## Technical Implementation

### Components

1. **ImageUpload Component** (`app/admin/components/ImageUpload.tsx`)
   - Reusable component for all admin sections
   - Props:
     - `currentImage`: Current image URL
     - `category`: Storage category
     - `onImageChange`: Callback when image changes
     - `label`: Display label (optional)

2. **Upload API Route** (`app/api/admin/upload/route.ts`)
   - Handles file upload
   - Validates file type and size
   - Saves to public folder
   - Returns public URL

### Integration Example

```tsx
import ImageUpload from '../components/ImageUpload';

// In your form component
<ImageUpload
  currentImage={formData.image}
  category="programs"
  onImageChange={(url) => setFormData({ ...formData, image: url })}
  label="Program Logo"
/>
```

### Security Considerations

1. **File Type Validation**: Only image types allowed
2. **File Size Limit**: 5MB maximum
3. **Authenticated Access**: Upload endpoint requires admin authentication
4. **Unique Filenames**: Prevents file overwrites
5. **Server-Side Validation**: All validation happens server-side

## File Size Optimization Tips

For admins uploading images:

1. **Resize Before Upload**: Use image editing tools to resize large images
2. **Recommended Dimensions**:
   - Announcements: 800x400px
   - Program Logos: 400x400px
   - Program Thumbnails: 600x400px
   - Research Images: 800x500px
   - Gallery Images: 1200x800px
   - Testimonial Photos: 300x300px
3. **Compression**: Use tools like TinyPNG or ImageOptim before uploading
4. **Format Selection**:
   - JPEG: Best for photos
   - PNG: Best for logos with transparency
   - WebP: Best overall compression (modern browsers)

## Troubleshooting

### Upload Fails

1. **Check file size**: Must be under 5MB
2. **Check file type**: Only JPEG, PNG, GIF, WebP allowed
3. **Check authentication**: Ensure you're logged in as admin
4. **Browser console**: Check for network errors

### Image Not Displaying

1. **Check file path**: Should start with `/images/`
2. **Check file exists**: Verify file in `public/images/{category}/`
3. **Clear browser cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
4. **Check permissions**: Ensure public folder has write permissions

### Large File Size

1. Use image compression before upload
2. Consider using external CDN for very large images
3. Convert images to WebP format for better compression

## Future Enhancements

Potential improvements:

- [ ] Bulk image upload
- [ ] Image cropping/editing in browser
- [ ] Automatic image optimization on server
- [ ] CDN integration
- [ ] Image gallery browser for reusing images
- [ ] Drag & drop directly into form
- [ ] Progress bar for large uploads
- [ ] Image metadata extraction (dimensions, size)

## Deployment Notes

### Production Considerations

1. **Storage**: Ensure public folder is writable
2. **CDN**: Consider using CDN for image hosting in production
3. **Backup**: Images in public folder should be backed up
4. **Docker**: If using Docker, ensure volume mounts include public folder

### Environment Requirements

- Node.js filesystem access
- Write permissions on `public/images/` directory
- No additional dependencies required (uses Node.js built-in `fs` module)

## Related Files

- `app/admin/components/ImageUpload.tsx` - Upload component
- `app/api/admin/upload/route.ts` - Upload API
- `app/admin/announcements/AdminAnnouncementsManager.tsx` - Example usage
- `app/admin/programs/AdminProgramsManager.tsx` - Logo/thumbnail upload
- `app/admin/research/AdminResearchManager.tsx` - Research image upload
- `app/admin/gallery/AdminGalleryManager.tsx` - Gallery image upload
- `app/admin/testimonials/AdminTestimonialsManager.tsx` - Profile photo upload

## Support

For issues or questions:
1. Check browser console for errors
2. Check server logs for upload failures
3. Verify file permissions on public folder
4. Review this guide for common issues
