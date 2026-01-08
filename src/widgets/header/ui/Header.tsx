import { ThemeToggle } from '@/features/toggle-theme'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Day-Atmos</h1>
        <ThemeToggle />
      </div>
    </header>
  )
}
