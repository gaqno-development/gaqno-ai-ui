import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@gaqno-development/frontcore/components/ui';
import type { IconComponent } from '@gaqno-development/frontcore/utils';

export interface AIPageLayoutTab {
  id: string;
  label: string;
  icon?: IconComponent;
}

export interface AIPageLayoutProps {
  tabs: AIPageLayoutTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
  title?: string;
}

export function AIPageLayout({ tabs, activeTab, onTabChange, children, title }: AIPageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-nowrap items-center gap-4 min-w-0">
            {title && (
              <h1 className="text-xl sm:text-2xl font-bold shrink-0">{title}</h1>
            )}
            <Tabs value={activeTab} onValueChange={onTabChange} className="min-w-0 flex-1">
              <TabsList className="inline-flex w-auto max-w-full justify-start">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col gap-1 px-3 py-2 min-h-[44px] sm:min-h-0"
                    >
                      <span className="flex flex-col items-center gap-1">
                        {Icon && <Icon className="h-5 w-5 shrink-0" />}
                        <span className="text-xs sm:text-sm">{tab.label}</span>
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}
