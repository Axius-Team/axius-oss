'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { FileRow } from '@/src/components/molecules/FileRow'
import { LoadingSpinner } from '@/src/components/atoms/LoadingSpinner'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { ArrowLeft, Save, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useMobile } from '@/src/hooks/useMobile'
import { toast } from '@/src/hooks/use-toast'

interface FileItem {
  name: string
  path: string
  type: 'file' | 'directory'
  size: number
  modified: string
}

export function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('/')
  const [items, setItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [editorContent, setEditorContent] = useState('')
  const [highlighted, setHighlighted] = useState('')
  const [dirty, setDirty] = useState(false)
  const isMobile = useMobile()
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const showSidebar = !selectedFile || (sidebarVisible && !(isMobile && selectedFile))
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const loadPath = useCallback(async (path: string) => {
    setLoading(true)
    setSelectedFile(null)
    setEditorContent('')
    setHighlighted('')
    setDirty(false)
    try {
      const res = await fetch('/api/files/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      const json = await res.json()
      if (json.success) {
        setItems(json.data)
        setCurrentPath(path)
      } else {
        toast({ title: json.error || 'Failed to list directory', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Failed to list directory', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
      loadPath('/')
    }
  }, [loaded, loadPath])

  const readFile = useCallback(async (path: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/files/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      const json = await res.json()
      if (json.success) {
        setEditorContent(json.data.content)
        setSelectedFile(path)
        setDirty(false)
        const ext = path.split('.').pop() || ''
        const langMap: Record<string, string> = {
          js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
          json: 'json', yml: 'yaml', yaml: 'yaml', md: 'markdown',
          py: 'python', rb: 'ruby', rs: 'rust', go: 'go',
          css: 'css', scss: 'scss', html: 'xml', xml: 'xml',
          sh: 'bash', bash: 'bash', zsh: 'bash',
          sql: 'sql', env: 'ini', gitignore: 'ini',
          dockerfile: 'dockerfile', toml: 'ini', lock: 'json',
        }
        const lang = langMap[ext] || ''
        try {
          const hljs = await import('highlight.js')
          const result = lang
            ? hljs.default.highlight(json.data.content, { language: lang, ignoreIllegals: true })
            : hljs.default.highlightAuto(json.data.content)
          setHighlighted(result.value)
        } catch {
          setHighlighted('')
        }
      } else {
        toast({ title: json.error || 'Failed to read file', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Failed to read file', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [])

  const saveFile = useCallback(async () => {
    if (!selectedFile || !dirty) return
    setSaving(true)
    try {
      const res = await fetch('/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFile, content: editorContent }),
      })
      const json = await res.json()
      if (json.success) {
        setDirty(false)
        toast({ title: 'File saved' })
      } else {
        toast({ title: json.error || 'Failed to save', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }, [selectedFile, editorContent, dirty])

  const handleScroll = useCallback(() => {
    if (scrollRef.current && textareaRef.current) {
      textareaRef.current.scrollTop = scrollRef.current.scrollTop
      textareaRef.current.scrollLeft = scrollRef.current.scrollLeft
    }
  }, [])

  const handleTextareaScroll = useCallback(() => {
    if (textareaRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = textareaRef.current.scrollTop
      scrollRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (dirty) saveFile()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveFile, dirty])

  const navigateUp = () => {
    const parent = currentPath === '/' ? '/' : currentPath.split('/').slice(0, -1).join('/') || '/'
    loadPath(parent)
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold">File Explorer</h2>
          <p className="text-muted-foreground">Browse and edit local files</p>
        </div>
        {selectedFile && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted text-xs text-muted-foreground">
              {selectedFile.split('/').pop()}
              {dirty && <span className="ml-1 text-yellow-500">*</span>}
            </div>
            <Button onClick={saveFile} disabled={!dirty || saving} size="sm">
              <Save className="h-4 w-4 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="icon" onClick={navigateUp}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Input value={currentPath} readOnly className="font-mono text-sm min-w-0 flex-1" />
        {selectedFile && !isMobile && (
          <Button variant="outline" size="icon" onClick={() => setSidebarVisible(!sidebarVisible)}>
            {sidebarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {showSidebar && (
          <div className={`rounded-lg border ${selectedFile && !isMobile ? 'w-72 shrink-0' : 'w-full'} flex flex-col`}>
            <div className="p-2 border-b bg-muted/50 shrink-0">
              <span className="text-xs font-medium text-muted-foreground">EXPLORER</span>
            </div>
            <ScrollArea className="flex-1">
              {loading && items.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="p-2 space-y-0.5">
                  {items.map((item) => (
                    <FileRow
                      key={item.path}
                      item={item}
                      onNavigate={loadPath}
                      onSelect={readFile}
                      isSelected={selectedFile === item.path}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {selectedFile && (
          <div className="flex-1 rounded-lg border flex flex-col min-w-0 max-w-full">
            <div className="p-2 border-b bg-muted/50 flex items-center gap-2 shrink-0">
              {isMobile && (
                <button onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-foreground p-1">
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <span className="text-xs font-medium text-muted-foreground flex-1">
                {selectedFile.split('/').pop()}
                {dirty && <span className="ml-1 text-yellow-500">* unsaved</span>}
              </span>
              <span className="text-xs text-muted-foreground">{isMobile ? '' : 'Ctrl+S to save'}</span>
            </div>
            <div className="flex-1 relative bg-muted/30 overflow-hidden">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="absolute inset-0 overflow-auto custom-scrollbar"
              >
                <div className="p-4 text-sm font-mono pointer-events-none select-none" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {highlighted ? (
                    <style>{`
                      .hljs { color: var(--foreground); background: transparent; }
                      .hljs-keyword, .hljs-literal, .hljs-symbol { color: #c586c0; }
                      .hljs-string, .hljs-doctag { color: #ce9178; }
                      .hljs-number, .hljs-boolean { color: #b5cea8; }
                      .hljs-comment { color: #6a9955; font-style: italic; }
                      .hljs-built_in { color: #dcdcaa; }
                      .hljs-attr { color: #9cdcfe; }
                      .hljs-title, .hljs-title.function_ { color: #dcdcaa; }
                      .hljs-title.class_ { color: #4ec9b0; }
                      .hljs-params { color: #9cdcfe; }
                      .hljs-property { color: #9cdcfe; }
                      .hljs-tag { color: #569cd6; }
                      .hljs-name { color: #569cd6; }
                      .hljs-attribute { color: #9cdcfe; }
                      .hljs-meta { color: #dcdcaa; }
                      .hljs-selector-class { color: #d7ba7d; }
                      .hljs-selector-id { color: #d7ba7d; }
                      .hljs-regexp { color: #d16969; }
                    `}</style>
                  ) : null}
                  <code>{highlighted ? <span dangerouslySetInnerHTML={{ __html: highlighted }} /> : editorContent}</code>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={editorContent}
                onChange={(e) => { setEditorContent(e.target.value); setDirty(true) }}
                onScroll={handleTextareaScroll}
                className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-foreground resize-none p-4 text-sm font-mono outline-none custom-scrollbar"
                spellCheck={false}
                autoComplete="off"
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', tabSize: 2 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
