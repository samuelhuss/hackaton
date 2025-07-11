// SidebarDocs.tsx
// Sidebar de navegação para documentação, inspirada no shadcn/ui
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'

// Grupos de seções da documentação
const GROUPS = [
  {
    title: 'SAGE AI',
    links: [
      { id: 'introducao', label: 'Introdução' },
      { id: 'visao-geral', label: 'Visão Geral' },

      { id: 'ml-experimentos', label: 'Experimentos ML' },
      { id: 'abordagem', label: 'Abordagem e Diferenciais' },
      { id: 'como-funciona', label: 'Como Funciona' },

      { id: 'tecnologias', label: 'Tecnologias Utilizadas' },
      { id: 'engenharia-prompt', label: 'Engenharia de Prompt' },
      { id: 'limitacoes', label: 'Limitações e Futuro' },

    ],
  },
]

export function SidebarDocs({ className }: { className?: string }) {
  // Estado para o hash atual da URL
  const [active, setActive] = useState('')

  useEffect(() => {
    const onHashChange = () => setActive(window.location.hash.replace('#', ''))
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col w-56 pt-14 pb-8 px-4 fixed h-full top-0 left-0 z-10 bg-white border-r border-border',
        className
      )}
      aria-label="Navegação da documentação"
    >
      <nav className="flex flex-col items-center gap-6">
        {GROUPS.map((group, i) => (
          <div key={group.title}>
            <span className="text-xs font-semibold text-muted-foreground mb-6  tracking-widest select-none block">
              {group.title}
            </span>
            <ul className="flex flex-col gap-3">
              {group.links.map(link => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={cn(
                      'block px-2 py-1 rounded transition text-[13px] font-medium',
                      active === link.id
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {i < GROUPS.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default SidebarDocs 