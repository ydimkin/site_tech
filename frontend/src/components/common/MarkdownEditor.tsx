import { useRef, useState } from 'react'
import { Bold, Italic, Heading1, Heading2, List, ImagePlus, Upload } from 'lucide-react'
import { uploadApi } from '@/api/misc'
import toast from 'react-hot-toast'

interface Props {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}

export default function MarkdownEditor({ value, onChange, rows = 10, placeholder }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const insert = (before: string, after = '') => {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)
    const next = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(next)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 0)
  }

  const uploadAndInsertImage = async (file: File, name?: string) => {
    setUploading(true)
    try {
      const res = await uploadApi.upload(file)
      const url = res.data.data.url
      const ta = taRef.current
      const pos = ta?.selectionStart ?? value.length
      const md = `\n\n![${name || file.name || 'image'}](${url})\n\n`
      const next = value.slice(0, pos) + md + value.slice(pos)
      onChange(next)
      toast.success('Изображение вставлено')
    } catch {
      toast.error('Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadAndInsertImage(file)
    e.target.value = ''
  }

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) await uploadAndInsertImage(file, 'pasted-image')
        return
      }
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1 p-2 border border-surface-border rounded-t-xl bg-surface/60 flex-wrap">
        <button type="button" className="btn btn-ghost btn-icon btn-sm" title="Жирный (**текст**)" onClick={() => insert('**', '**')}>
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" title="Курсив (*текст*)" onClick={() => insert('*', '*')}>
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" title="Заголовок (## Текст)" onClick={() => insert('## ')}>
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" title="Подзаголовок (### Текст)" onClick={() => insert('### ')}>
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" title="Список (- пункт)" onClick={() => insert('- ')}>
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" title="Вставить ссылку на изображение" onClick={() => insert('![описание](', ')')}>
          <ImagePlus className="w-3.5 h-3.5" />
        </button>
        <div className="ml-auto">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading} title="Загрузить и вставить изображение (или просто вставьте Ctrl+V)">
            <Upload className="w-3.5 h-3.5" /> {uploading ? 'Загрузка...' : 'Фото'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>
      </div>
      <textarea
        ref={taRef}
        className="input resize-none rounded-t-none border-t-0 font-mono text-sm"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder={placeholder ? placeholder + '\n\n💡 Подсказка: можно вставить фото прямо из буфера обмена (Ctrl+V).' : undefined}
      />
    </div>
  )
}
