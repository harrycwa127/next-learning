import { useKBar } from 'kbar';

import CommandSvg from './CommandSvg';

export default function CommandPaletteToggle() {
  const { query } = useKBar();

  return (
    <button
      aria-label="Toggle Command Palette"
      type="button"
      className="block h-12 w-8 rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:w-10 sm:p-3"
      onClick={query.toggle}
    >
      <CommandSvg />
    </button>
  );
}
