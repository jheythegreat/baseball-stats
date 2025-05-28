"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface PlayerCardProps {
  initialPhoto?: string
  onPhotoChange?: (photo: string) => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({ initialPhoto, onPhotoChange }) => {
  const { t } = useTranslation()
  const [photo, setPhoto] = useState<string | undefined>(initialPhoto)
  const [tempPhoto, setTempPhoto] = useState<string | undefined>(initialPhoto)
  const [showPhotoDialog, setShowPhotoDialog] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 })

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempPhoto(reader.result as string)
        setShowPhotoDialog(true)
        setZoom(100)
        setPosition({ x: 0, y: 0 })
      }
      reader.readAsDataURL(file)
    }
  }

  const applyPhotoChanges = () => {
    setPhoto(tempPhoto)
    onPhotoChange?.(tempPhoto || "")
    setShowPhotoDialog(false)
  }

  const cancelPhotoChanges = () => {
    setTempPhoto(photo)
    setShowPhotoDialog(false)
    setZoom(100)
    setPosition({ x: 0, y: 0 })
  }

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0])
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(true)
      setInitialPosition(position)
      setInitialMousePosition({ x: e.clientX, y: e.clientY })
    },
    [position],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setIsDragging(true)
      setInitialPosition(position)
      setInitialMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    },
    [position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        const deltaX = e.clientX - initialMousePosition.x
        const deltaY = e.clientY - initialMousePosition.y
        setPosition({
          x: initialPosition.x + deltaX,
          y: initialPosition.y + deltaY,
        })
      }
    },
    [isDragging, initialMousePosition, initialPosition],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isDragging) {
        const deltaX = e.touches[0].clientX - initialMousePosition.x
        const deltaY = e.touches[0].clientY - initialMousePosition.y
        setPosition({
          x: initialPosition.x + deltaX,
          y: initialPosition.y + deltaY,
        })
      }
    },
    [isDragging, initialMousePosition, initialPosition],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div className="player-card">
      <div className="photo-section">
        <div className="photo-container">
          {photo ? (
            <img src={photo || "/placeholder.svg"} alt="Player" />
          ) : (
            <div className="placeholder">{t.noPhoto}</div>
          )}
        </div>
        <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        <label htmlFor="photo-upload" className="upload-button">
          {t.uploadPhoto}
        </label>
      </div>

      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>{t.adjustPhoto}</DialogTitle>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div
              className="w-80 h-80 rounded-full overflow-hidden photo-container relative border-4 border-gray-200 dark:border-gray-700"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              style={{ cursor: "move" }}
            >
              {tempPhoto && (
                <>
                  <div className="position-indicator" />
                  <img
                    src={tempPhoto || "/placeholder.svg"}
                    alt="Preview"
                    className="photo-draggable"
                    style={{
                      transform: `scale(${zoom / 100}) translate(${position.x / (zoom / 100)}px, ${position.y / (zoom / 100)}px)`,
                      transformOrigin: "center center",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    draggable={false}
                  />
                  <div className="photo-adjustment-overlay">
                    <div className="photo-adjustment-text">{t.movePhoto}</div>
                  </div>
                </>
              )}
            </div>

            <div className="w-full max-w-sm space-y-6">
              <div className="zoom-control">
                <div className="flex justify-between items-center">
                  <Label htmlFor="zoom-slider" className="text-sm font-medium">
                    {t.zoom}
                  </Label>
                  <span className="text-sm text-muted-foreground">{zoom}%</span>
                </div>
                <Slider
                  id="zoom-slider"
                  min={50}
                  max={200}
                  step={5}
                  value={[zoom]}
                  onValueChange={handleZoomChange}
                  className="mt-2"
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">💡 {t.photoRecommendation}</p>
                <p className="text-xs text-muted-foreground">
                  Arrastra la imagen para posicionar tu rostro en el centro
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between gap-2 mt-6">
            <Button variant="outline" onClick={cancelPhotoChanges} className="flex-1">
              {t.cancel}
            </Button>
            <Button onClick={applyPhotoChanges} className="flex-1">
              {t.apply}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlayerCard
