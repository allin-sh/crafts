import { Pane } from 'tweakpane';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { PaneConfig } from 'tweakpane/dist/types/pane/pane-config';

export type PaneProps<T extends Record<string, unknown>> = {
  defaultConfig: T;
} & PaneConfig;

/**
 * @description
 * 디버그 설정을 위한 패널을 생성
 * https://tweakpane.github.io/docs/
 *
 * @example
 * ```tsx
 * 
 * const SETTINGS = { outline: true };
 * 
  const { pane, __DEV_config, setConfig } = usePane({
    defaultConfig: SETTINGS,
    title: 'Setting',
  });

  useEffect(() => {
    if (!pane) return;
    pane.addBinding(SETTINGS, 'outline', { label: 'jack' }).on('change', setConfig);
  }, [pane]);
 *
 * ```
 */
export const usePane = <Config extends Record<string, unknown>>({
  defaultConfig,
  ...paneProps
}: PaneProps<Config>): {
  pane: Pane | null;
  __DEV_config: Config;
  setConfig: Parameters<Pane['on']>[1];
  _setConfig: Dispatch<SetStateAction<Config>>;
} => {
  const [pane, setPane] = useState<Pane | null>(null);
  const [config, _setConfig] = useState<Config>(defaultConfig);

  useEffect(() => {
    const pane = new Pane({
      ...paneProps,
    });

    setPane(pane);
    return () => {
      pane.dispose();
    };
  }, []);

  const setConfig: Parameters<Pane['on']>[1] = ev => {
    // @ts-ignore
    const key = ev.target.key;
    // @ts-ignore
    const value = ev.value;

    _setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    pane,
    __DEV_config: config,
    setConfig,
    _setConfig,
  };
};
