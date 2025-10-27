import React, { createContext, useContext } from 'react';

export interface TemplateField {
  name: string;
  label?: string;
  description?: string;
}

interface TemplateFieldsContextType {
  fields: (string | TemplateField)[];
}

const TemplateFieldsContext = createContext<TemplateFieldsContextType>({
  fields: [],
});

export function useTemplateFields(): (string | TemplateField)[] {
  const context = useContext(TemplateFieldsContext);
  return context.fields;
}

interface TemplateFieldsProviderProps {
  children: React.ReactNode;
  fields?: (string | TemplateField)[];
}

export function TemplateFieldsProvider({ children, fields = [] }: TemplateFieldsProviderProps) {
  return (
    <TemplateFieldsContext.Provider value={{ fields }}>
      {children}
    </TemplateFieldsContext.Provider>
  );
}

