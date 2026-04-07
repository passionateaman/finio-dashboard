export const fmt = (n: number) =>
  '₹' + n.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

export const CAT_COLORS: Record<string, string> = {
  Food: '#f87171', Transport: '#fbbf24', Shopping: '#a78bfa',
  Entertainment: '#38bdf8', Health: '#34d399', Utilities: '#fb923c', Income: '#6c7fff'
}

export const CAT_ICONS: Record<string, string> = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️',
  Entertainment: '🎬', Health: '❤️', Utilities: '🔌', Income: '💰'
}