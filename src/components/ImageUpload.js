"use client"

import { useState, useRef } from "react"
import { Upload, X, CheckCircle, AlertCircle, ImageIcon } from "lucide-react"

const ImageUpload = ({ onImagesChange, maxImages = 5 }) => {
  const [images, setImages] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)

  const REQUIRED_DIMENSIONS = {
    width: 800,
    height: 600,
    aspectRatio: 4 / 3,
  }

  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

  const validateImage = (file) => {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.onload = () => {
        const errors = []

        // Check file type
        if (!file.type.startsWith("image/")) {
          errors.push("File must be an image")
          return resolve({ valid: false, errors, file })
        }

        // Always resize to 800x600
        const canvas = document.createElement("canvas")
        canvas.width = REQUIRED_DIMENSIONS.width
        canvas.height = REQUIRED_DIMENSIONS.height

        const ctx = canvas.getContext("2d")

        // Stretch image to exactly 800x600 (no aspect ratio preserved)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
            })

            // Check final file size
            if (resizedFile.size > MAX_FILE_SIZE) {
              errors.push("Resized image is larger than 2MB")
            }

            const preview = canvas.toDataURL("image/jpeg")
            resolve({
              valid: errors.length === 0,
              errors,
              file: resizedFile,
              preview,
            })
          },
          "image/jpeg",
          0.9 // JPEG quality (0–1)
        )
      }

      img.onerror = () => {
        resolve({ valid: false, errors: ["Invalid image file"], file })
      }

      img.src = e.target.result
    }

    reader.readAsDataURL(file)
  })
}

  const handleFiles = async (files) => {
    const fileArray = Array.from(files)

    if (images.length + fileArray.length > maxImages) {
      setErrors([`Maximum ${maxImages} images allowed`])
      return
    }

    const validationResults = await Promise.all(fileArray.map((file) => validateImage(file)))

    const validImages = validationResults.filter((result) => result.valid)
    const invalidImages = validationResults.filter((result) => !result.valid)

    if (invalidImages.length > 0) {
      const allErrors = invalidImages.flatMap((result) => result.errors)
      setErrors(allErrors)
    } else {
      setErrors([])
    }

    if (validImages.length > 0) {
      const newImages = [...images, ...validImages]
      setImages(newImages)
      onImagesChange(newImages)
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className="space-y-6">
      {/* Image Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in-up">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Image Requirements
        </h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>
            • Maximum dimensions: {REQUIRED_DIMENSIONS.width}x{REQUIRED_DIMENSIONS.height} pixels (4:3 aspect ratio)
          </li>
          <li>• File size: Maximum 2MB</li>
          <li>• Format: JPG, PNG, or WebP</li>
          <li>• Maximum {maxImages} images per product</li>
          <li>• High quality, well-lit photos work best</li>
        </ul>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 animate-fade-in-up delay-200 ${
          dragActive ? "border-[#FF8C1A] bg-orange-50" : "border-gray-300 hover:border-[#FF8C1A] hover:bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your images here, or <span className="text-[#FF8C1A]">browse</span>
            </p>
            <p className="text-sm text-gray-500">Upload up to {maxImages} high-quality product images</p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#FF8C1A] text-white px-6 py-2 rounded-lg hover:bg-[#FF8C1A]/90 transition-colors"
          >
            Choose Files
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in-up">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">Upload Errors</h4>
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-4 animate-fade-in-up delay-300">
          <h4 className="font-semibold text-[#00264D] flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Uploaded Images ({images.length}/{maxImages})
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={image.preview || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover"
                />

                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                  {REQUIRED_DIMENSIONS.width}x{REQUIRED_DIMENSIONS.height}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-4 animate-fade-in-up delay-400">
        <h4 className="font-medium text-gray-800 mb-2">📸 Photography Tips</h4>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>• Use natural lighting when possible</li>
          <li>• Show your product from multiple angles</li>
          <li>• Include close-ups of important details</li>
          <li>• Use a clean, uncluttered background</li>
          <li>• Ensure images are sharp and in focus</li>
        </ul>
      </div>
    </div>
  )
}

export default ImageUpload
