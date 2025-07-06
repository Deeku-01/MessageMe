"use client"

import { useThemeStore } from "../store/useThemeStore"

const themes = [
  { 
    value: "light", 
    label: "Light",
    icon: "☀️",
    colors: { bg: "bg-white", accent: "bg-blue-500" }
  },
  { 
    value: "dark", 
    label: "Dark",
    icon: "🌙",
    colors: { bg: "bg-gray-900", accent: "bg-purple-500" }
  },
  { 
    value: "valentine", 
    label: "Valentine",
    icon: "💕",
    colors: { bg: "bg-pink-100", accent: "bg-pink-500" }
  },
  { 
    value: "black", 
    label: "Black",
    icon: "🖤",
    colors: { bg: "bg-black", accent: "bg-gray-500" }
  },
] as const

type Theme = typeof themes[number]["value"]

export default function ThemeSelector() {
  const { theme, setTheme } = useThemeStore()

  const handleThemeChange = (newTheme: Theme) => {
    try {
      setTheme(newTheme)
      // Close dropdown by removing focus
      if (document.activeElement) {
        (document.activeElement as HTMLElement).blur()
      }
    } catch (error) {
      console.error('Failed to change theme:', error)
    }
  }

  const currentTheme = themes.find(t => t.value === theme)
  const currentThemeLabel = currentTheme?.label || 'Theme'

  return (
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost gap-2 hover:bg-base-200 transition-colors duration-200"
        aria-label={`Current theme: ${currentThemeLabel}. Click to change theme`}
        aria-haspopup="true"
        aria-expanded="false"
      >
        {/* Theme preview circle */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-base-content/20 flex items-center justify-center overflow-hidden">
            {currentTheme && (
              <div className={`w-full h-full ${currentTheme.colors.bg} relative`}>
                <div className={`absolute inset-0 ${currentTheme.colors.accent} opacity-60`}></div>
              </div>
            )}
          </div>
          <span className="text-sm font-medium">{currentThemeLabel}</span>
        </div>
        
        {/* Dropdown arrow */}
        <svg className="w-4 h-4 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      
      <ul 
        tabIndex={0} 
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow-lg border border-base-300"
        role="menu"
        aria-label="Theme options"
      >
        {themes.map((t) => (
          <li key={t.value} role="none">
            <button 
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-base-200 ${
                theme === t.value ? "bg-primary/10 text-primary border-2 border-primary/20" : "border-2 border-transparent"
              }`}
              onClick={() => handleThemeChange(t.value)}
              role="menuitem"
              aria-current={theme === t.value ? "true" : "false"}
            >
              {/* Theme preview */}
              <div className="flex items-center gap-2 flex-1">
                <div className="w-6 h-6 rounded-full border-2 border-base-content/20 flex items-center justify-center overflow-hidden">
                  <div className={`w-full h-full ${t.colors.bg} relative`}>
                    <div className={`absolute inset-0 ${t.colors.accent} opacity-60`}></div>
                  </div>
                </div>
                <span className="text-lg">{t.icon}</span>
                <span className="font-medium">{t.label}</span>
              </div>
              
              {/* Active indicator */}
              {theme === t.value && (
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}