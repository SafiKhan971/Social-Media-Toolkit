import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '../../services/api'
import GeneratedShortPreview from './GeneratedShortPreview'

const DEFAULT_VOICES = [
  { id: 'en-US-AriaNeural', label: 'Aria (US Female)' },
  { id: 'en-US-GuyNeural', label: 'Guy (US Male)' },
  { id: 'ur-PK-UzmaNeural', label: 'Uzma (Urdu Female)' },
  { id: 'ur-PK-AsadNeural', label: 'Asad (Urdu Male)' },
]

export default function GenerateShort() {
  const [voices, setVoices] = useState(DEFAULT_VOICES)
  const [voice, setVoice] = useState('')
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatedShort, setGeneratedShort] = useState(null)

  const apiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`${apiUrl}/shorts/voices`)
        setVoices(data.voices?.length ? data.voices : DEFAULT_VOICES)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [apiUrl])

  const handleSubmit = async e => {
    e.preventDefault()
    if (script.trim().length < 20) {
      toast.error('Voice script must be at least 20 characters')
      return
    }

    const toastId = toast.loading('Creating your YouTube Short from video clips. This can take a couple of minutes...')
    try {
      setGenerating(true)
      const { data } = await api.post(
        `${apiUrl}/shorts/generate`,
        {
          script: script.trim(),
          voice: voice || undefined,
        },
        { timeout: 240000 }
      )
      setGeneratedShort(data.short)
      toast.dismiss(toastId)
      toast.success(data.message || 'YouTube Short generated')
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err.response?.data?.message || err.message || 'Failed to generate Short')
    } finally {
      setGenerating(false)
    }
  }

  const resetForm = () => {
    setGeneratedShort(null)
    setScript('')
    setVoice('')
  }

  if (generatedShort) {
    return <GeneratedShortPreview generatedShort={generatedShort} onCreateAnother={resetForm} />
  }

  return (
    <div className="page-card">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success shadow-sm">
          <span className="text-lg">🎬</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">YouTube Shorts</h1>
          <p className="text-sm text-neutral-500">Turn a voice script into a vertical video with related video clips</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-green-500" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="form-label">Voice</label>
            <select value={voice} onChange={e => setVoice(e.target.value)} className="form-input">
              <option value="">Auto-detect from script</option>
              {voices.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="form-label mb-0">Voice Script</label>
              <span className={`text-xs ${script.length > 1500 ? 'text-red-500' : 'text-neutral-400'}`}>
                {script.length}/1500
              </span>
            </div>
            <textarea
              value={script}
              onChange={e => setScript(e.target.value)}
              className="form-input min-h-44 resize-y"
              maxLength={1500}
              placeholder="Write the words you want spoken in the Short. Related video clips will be searched from your script."
              required
            />
            <p className="mt-2 text-xs text-neutral-400">
              Keep it under about 60 seconds. Related clips are matched to the script from Pexels and Pixabay. If no clip is found, a still image is used for that scene.
            </p>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <button type="submit" disabled={generating} className="btn-primary">
              {generating ? 'Creating Short...' : '🎬 Create YouTube Short'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
