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
          {title && <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{title}</h1>}
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="w-full sm:w-auto justify-start">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {Icon && <Icon className="h-4 w-4 mr-2 shrink-0" />}
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}
