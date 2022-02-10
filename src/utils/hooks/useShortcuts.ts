import { useCallback } from 'react'
import useEvent from './useEvent';

export enum Key {
  Q = 'KeyQ',
  W = 'KeyW',
  E = 'KeyE',
  R = 'KeyR',
  T = 'KeyT',
  Y = 'KeyY',
  U = 'KeyU',
  I = 'KeyI',
  O = 'KeyO',
  P = 'KeyP',
  A = 'KeyA',
  S = 'KeyS',
  D = 'KeyD',
  F = 'KeyF',
  G = 'KeyG',
  H = 'KeyH',
  J = 'KeyJ',
  K = 'KeyK',
  L = 'KeyL',
  Z = 'KeyZ',
  X = 'KeyX',
  C = 'KeyC',
  V = 'KeyV',
  B = 'KeyB',
  N = 'KeyN',
  M = 'KeyM',
}

export enum Mod {
  Alt = 'altKey',
  Opt = 'altKey',
  Ctrl = 'ctrlKey',
  Cmd = 'metaKey',
  Shift = 'shiftKey',
}

interface IHandler {
  key: Key,
  mods?: Mod[],
  handler: (e: KeyboardEvent) => void,
}

const useShortcuts = (
  handlers: IHandler[],
  element: HTMLElement | Document = document,
) => {

  const onKeydown = useCallback((event) => {
    Object.values(handlers).forEach((handler) => {
      const { key, mods, handler: callback } = handler;
      let isCallable = true;

      mods?.forEach((mod) => {
        if (!event[mod]) {
          isCallable = false;
          return;
        }
      });

      if (isCallable && key === event.code) {
        callback(event);
      }
    });
  }, [handlers]);

  useEvent(element, [onKeydown], 'keydown', onKeydown);
}

export default useShortcuts;
