import { useTranslation } from 'next-i18next';

import CommandPaletteToggle from '@/components/CommandPaletteToggle';
import CustomLink from '@/components/CustomLink';
import LanguageSwitch from '@/components/LanguageSwitch';
import MobileNav from '@/components/MobileNav';
import SectionContainer from '@/components/SectionContainer';
import ThemeSwitch from '@/components/ThemeSwitch';
import { headerConfigs } from '@/configs/headerConfigs';

import logoImage from '../../public/logo.png';
import CustomImage from './CustomImage';

export default function Header() {
  const { t } = useTranslation(['common']);

  return (
    <header className="sticky top-0 z-10 border-b border-slate-900/10 bg-white/70 pt-3 pb-1 backdrop-blur transition-colors dark:border-slate-50/[0.06] dark:bg-gray-900/60">
      <SectionContainer>
        <div className="flex justify-between">
          <div className="flex items-center">
            <CustomLink href="/" aria-label={headerConfigs.title}>
              <div className="flex items-center">
                <div className="h-12 w-12">
                  <CustomImage
                    src={logoImage}
                    alt="Logo Image"
                    aria-label="Logo Image"
                  />
                </div>

                <div className="flex h-12 items-center text-2xl font-semibold">
                  {headerConfigs.title}
                </div>
              </div>
            </CustomLink>
          </div>

          <div className="flex items-center text-base leading-5 sm:gap-1">
            <div className="hidden gap-1 sm:flex">
              {headerConfigs.navLinks.map((link) => (
                <CustomLink
                  key={link.title}
                  href={link.href}
                  className="rounded p-3 font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  {t(link.title)}
                </CustomLink>
              ))}
            </div>

            <LanguageSwitch />
            <ThemeSwitch />
            <CommandPaletteToggle />
            <MobileNav />
          </div>
        </div>
      </SectionContainer>
    </header>
  );
}
