'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbContextValue {
  crumbs: Crumb[];
  setCrumbs: (crumbs: Crumb[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  crumbs: [],
  setCrumbs: () => {},
});

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  return (
    <BreadcrumbContext.Provider value={{ crumbs, setCrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  return useContext(BreadcrumbContext);
}
