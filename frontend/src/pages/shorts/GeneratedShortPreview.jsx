import { FaRedo } from 'react-icons/fa'
import { toast } from 'sonner'
import api from '../../services/api'

export default function GeneratedShortPreview({ generatedShort, onCreateAnother }) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedShort.caption || '')
    toast.success('Caption copied')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = generatedShort.videoUrl
    link.download = 'youtube-short.mp4'
    link.click()
  }

  const handleSave = async () => {
    const toastId = toast.loading('Saving Short...')
    try {
      await api.post(`${apiUrl}/shorts/save`, {
        script: generatedShort.script,
        videoUrl: generatedShort.videoUrl,
        thumbnailUrl: generatedShort.thumbnailUrl,
        caption: generatedShort.caption,
        duration: generatedShort.duration,
        voice: generatedShort.voice,
      })
      toast.dismiss(toastId)
      toast.success('Short saved')
      onCreateAnother()
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err.response?.data?.message || 'Failed to save Short')
    }
  }

  return (
    <div className="page-card">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success shadow-sm">
            <span className="text-lg">▶️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Your YouTube Short</h1>
            <p className="text-sm text-neutral-500">{generatedShort.duration}s · 1080×1920</p>
          </div>
        </div>
        <button type="button" onClick={onCreateAnother} className="btn-secondary">
          <FaRedo /> Create another
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="mx-auto w-full max-w-[280px]">
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-black shadow-lg">
            <video
              src={generatedShort.videoUrl}
              poster={generatedShort.thumbnailUrl}
              controls
              playsInline
              className="aspect-[9/16] h-auto w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h2 className="section-heading mb-2">Voice script</h2>
            <p className="rounded-lg bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-700">{generatedShort.script}</p>
          </div>

          <div>
            <h2 className="section-heading mb-2">YouTube caption</h2>
            <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-700">
              {generatedShort.caption}
            </p>
          </div>

          {generatedShort.scenes?.length > 0 && (
            <div>
              <h2 className="section-heading mb-2">Scene clips</h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {generatedShort.scenes.map((scene, index) => (
                  <img
                    key={index}
                    src={scene.imageUrl}
                    alt={scene.query || `Scene ${index + 1}`}
                    title={scene.text}
                    className="h-28 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-3 border-t border-neutral-100 pt-4">
            <button type="button" onClick={handleDownload} className="btn-secondary">
              📥 Download MP4
            </button>
            <button type="button" onClick={handleCopyCaption} className="btn-secondary">
              📋 Copy caption
            </button>
            <button type="button" onClick={handleSave} className="btn-primary">
              💾 Save Short
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
