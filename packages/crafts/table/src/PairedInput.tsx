import { type ReactNode, useState } from 'react';

export type PairedInputValues = {
  first: string;
  second: string;
};

export type PairedInputSetValues = {
  first: (value: string) => void;
  second: (value: string) => void;
};

export type PairedInputRenderProps = {
  values: PairedInputValues;
  setValues: PairedInputSetValues;
};

export type PairedInputProps = {
  children: (props: PairedInputRenderProps) => ReactNode;
  defaultValues?: Partial<PairedInputValues>;
};

export const PairedInput = ({ children, defaultValues }: PairedInputProps) => {
  const [values, setValues] = useState<PairedInputValues>(() => ({
    first: defaultValues?.first ?? '',
    second: defaultValues?.second ?? '',
  }));

  return children({
    values,
    setValues: {
      first: value => setValues(prev => ({ ...prev, first: value })),
      second: value => setValues(prev => ({ ...prev, second: value })),
    },
  });
};
