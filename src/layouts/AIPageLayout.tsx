import React from 'react';
import { PageLayout, type PageLayoutTab } from '@gaqno-development/frontcore/components/layout';
import { useTranslation } from '@gaqno-development/frontcore/i18n';
import type { IconComponent } from '@gaqno-development/frontcore/utils';

export interface AIPageLayoutTab {
  id: string;
  label: string;
  icon?: IconComponent;
  tKey?: string;
}

export interface AIPageLayoutProps {
  tabs: readonly AIPageLayoutTab[] | AIPageLayoutTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
  title?: string;
}

export function AIPageLayout({ tabs, activeTab, onTabChange, children, title }: AIPageLayoutProps) {
  const { t } = useTranslation('navigation');

  const pageLayoutTabs: PageLayoutTab[] = React.useMemo(
    () =>
      tabs.map((tab) => {
        const Icon = tab.icon;
        return {
          id: tab.id,
          label: tab.tKey ? t(tab.tKey) : tab.label,
          icon: Icon ? <Icon className="h-4 w-4" /> : null,
        };
      }),
    [tabs, t]
  );

  return (
    <PageLayout
      title={title ?? t('ai.title')}
      tabs={pageLayoutTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      layoutId="aiActiveTab"
    >
      {children}
    </PageLayout>
  );
}
