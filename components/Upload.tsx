import { CheckCircle, CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useOutletContext } from 'react-router'
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from '../lib/constants'

interface UploadProps {
    onComplete?: (base64: string) => void
}

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [progress, setProgress] = useState(0)

    const { isSignedIn } = useOutletContext<AuthContext>()

    const processFile = (file: File) => {
        if (!isSignedIn) return
        setFile(file)

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const base64Data = reader.result as string
            let currentProgress = 0
            const interval = setInterval(() => {
                currentProgress += PROGRESS_STEP
                setProgress(currentProgress)
                if (currentProgress >= 100) {
                    clearInterval(interval)
                    setTimeout(() => {
                        onComplete?.(base64Data)
                    }, REDIRECT_DELAY_MS)
                }
            }, PROGRESS_INTERVAL_MS)
        }
    }

  return (
    <div className='upload'>
      {!file ? (
        <div
          className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile) processFile(droppedFile)
          }}
        >
            <input
                type='file' className='drop-input' accept='.jpg,.jpeg,.png' disabled={!isSignedIn}
                onChange={(e) => {
                    const selected = e.target.files?.[0]
                    if (selected) processFile(selected)
                }}
            />
            
            <div className='drop-content'>
                <div className='drop-icon'>
                    <UploadIcon size={20}/>
                </div>
                <p>
                    {isSignedIn ? (
                        "Click to upload or just drag and drop"
                    ): ("Sign in or sign up with Puter to upload")}
                </p>
                <p className='help'>
                    Maximum file size 50MB
                </p>
            </div>

        </div>
      ) : (
        <div className='upload-status'>   
            <div className='status-content'>
                <div className='status-icon'>
                    {progress === 100 ? (
                        <CheckCircle2 className='check' />
                    ) : (
                        <ImageIcon className='image' />
                    )}
                </div>

                <h3>{file.name}</h3>

                <div className='progress'>
                    <div className='bar' style={{ width: `${progress}%` }}/>
                    
                    <p className='status-text'>
                        {progress < 100 ? 'Analyzing Floor Plan...' : 'Redirecting...'}
                    </p>
                </div>
            </div>
        </div>
      ) }
    </div>
  )
}

export default Upload
