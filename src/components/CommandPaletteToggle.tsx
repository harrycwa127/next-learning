import { useKBar } from 'kbar';

import CommandSvg from './CommandSvg';

export default function CommandPaletteToggle() {
  const { query } = useKBar();

  return (
    <button
      aria-label="Toggle Command Palette"
      type="button"
      className="block h-12 w-12 rounded py-3 px-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={query.toggle}
    >
      <CommandSvg />
    </button>
  );
}
