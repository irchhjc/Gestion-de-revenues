import { ArrowLeftRight, CalendarClock, X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onTransaction: () => void
  onPlanned: () => void
}

export function ActionSheet({ open, onClose, onTransaction, onPlanned }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-ink-800 rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 animate-slide-up safe-bottom"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Que voulez-vous ajouter ?</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <X size={18} className="text-white/70" />
          </button>
        </div>

        <div className="p-5 pt-2 space-y-3">
          <button
            onClick={() => {
              onTransaction()
              onClose()
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] active:scale-[0.98] transition text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-glow shrink-0">
              <ArrowLeftRight size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-base">Transaction</div>
              <div className="text-white/50 text-xs mt-0.5">
                Revenu ou dépense déjà effectuée
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onPlanned()
              onClose()
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] active:scale-[0.98] transition text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-card shrink-0">
              <CalendarClock size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-base">Échéance ou dette</div>
              <div className="text-white/50 text-xs mt-0.5">
                À payer ou à recevoir plus tard
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
