export function renderMarkdown(text: string): string {
  if (!text) return ''
  const html = text
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-content-main mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-content-main mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-content-main mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-4 max-w-full mx-auto" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-400 hover:underline">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-content-muted">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul class="my-2 space-y-1">${m}</ul>`)
    .replace(/\n\n/g, '</p><p class="text-content-muted leading-relaxed mb-3">')
    .replace(/\n/g, '<br />')
  return '<p class="text-content-muted leading-relaxed mb-3">' + html + '</p>'
}

export function markdownToPlain(text: string): string {
  if (!text) return ''
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_`>-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
