type Props = {
  children: React.ReactNode;
  small?: boolean;
};

export default function TagDisplay({ children, small }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-md font-medium border border-gray-200 bg-gray-50/50 text-gray-600 leading-none dark:border-zinc-700 dark:bg-zinc-800/30 dark:text-zinc-400 shrink-0 ${
        small 
          ? 'text-xs px-1.5 py-0.5'
          : 'text-sm px-2.5 py-1' // 針對 text-sm 微調 py 確保高度比例完美
      }`}
    >
      {children}
    </span>
  );
}

export interface Tag {
  value: string;
  eng_name: string;
  chi_name: string;
}