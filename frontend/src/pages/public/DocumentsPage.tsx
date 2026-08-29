import { useEffect, useState } from 'react'
import { documentsApi } from '@/api/misc'
import type { Document } from '@/types'
import { FadeIn, Stagger, StaggerItem } from '@/components/common/Animated'
import { FileText, Download, ExternalLink, ShieldCheck } from 'lucide-react'

const CATEGORY_NAMES: Record<string, string> = {
  charter: 'Устав и учредительные документы',
  license: 'Образовательная лицензия',
  certificate: 'Сертификаты и аккредитации',
  other: 'Дополнительные документы',
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    documentsApi.list()
      .then((r) => setDocuments(r.data.data || []))
      .finally(() => setLoading(false))
  }, [])


  const groupedDocs = documents.reduce<Record<string, Document[]>>((acc, doc) => {
    const cat = doc.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(doc)
    return acc
  }, {})

  return (
    <div className="container-page py-12">
      <FadeIn>
        <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
          <ShieldCheck className="w-8 h-8 text-primary-400" />
          <h1 className="section-title mb-0">Документы и сведения</h1>
        </div>
        <p className="section-subtitle mb-10 text-center sm:text-left">
          Официальные документы, лицензии и сертификаты детского технопарка. Все сведения представлены в соответствии с законодательством.
        </p>
      </FadeIn>

      {loading ? (
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="skeleton h-8 w-64 rounded-xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="skeleton h-20 rounded-2xl" />
                <div className="skeleton h-20 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-20 bg-surface/30 border border-surface-border/50 rounded-3xl">
          <FileText className="w-12 h-12 text-content-muted/30 mx-auto mb-4" />
          <div className="text-content-muted text-lg">Официальные документы скоро будут опубликованы.</div>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(CATEGORY_NAMES).map((catKey) => {
            const docs = groupedDocs[catKey] || []
            if (docs.length === 0) return null

            return (
              <FadeIn key={catKey} className="space-y-4">
                <h2 className="text-xl font-bold text-content-main border-l-4 border-primary-500 pl-3">
                  {CATEGORY_NAMES[catKey]}
                </h2>
                
                <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-4" whileInView={false}>
                  {docs.map((doc) => (
                    <StaggerItem key={doc.id}>
                      <div className="card-hover p-4 flex items-center justify-between gap-4 group h-full">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-800/80 group-hover:bg-primary-500/20 text-primary-400 flex items-center justify-center transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-content-main font-semibold text-sm line-clamp-1 group-hover:text-primary-400 transition-colors">
                              {doc.title}
                            </h3>
                            <p className="text-content-muted text-[11px] mt-0.5 uppercase tracking-wider font-semibold">
                              {CATEGORY_NAMES[catKey]}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-lg bg-surface hover:bg-slate-800 text-content-muted hover:text-content-main flex items-center justify-center border border-surface-border transition-all"
                            title="Открыть"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <a
                            href={doc.file_url}
                            download
                            className="w-9 h-9 rounded-lg bg-primary-500/10 hover:bg-primary-500 text-primary-400 hover:text-white flex items-center justify-center border border-primary-500/20 transition-all"
                            title="Скачать"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </FadeIn>
            )
          })}
        </div>
      )}
    </div>
  )
}
