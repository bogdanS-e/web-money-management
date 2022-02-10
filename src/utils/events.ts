import { KeyboardEvent, MouseEventHandler } from 'react';

type EventHandler<T> = (e: T) => void

const events = (...events: EventHandler<KeyboardEvent>[]) => (e: KeyboardEvent) => {
  events.forEach(handler => handler(e));
};

const onEnter = (
  handler: (e: KeyboardEvent) => void,
): EventHandler<KeyboardEvent> => e => {
  if (e.key === 'Enter') {
    handler(e);
  }
};

const onEscape = (
  handler: (e: KeyboardEvent) => void,
): EventHandler<KeyboardEvent> => e => {
  if (e.key === 'Escape') {
    handler(e);
  }
};

const onBackspace = (
  handler: (e: KeyboardEvent) => void,
): EventHandler<KeyboardEvent> => e => {
  if (e.key === 'Backspace') {
    handler(e);
  }
};

const stopPropagation = (handler?: EventHandler<Event>) => (e: Event) => {
  e.stopPropagation();

  handler?.(e);
};

const letHighlight = (
  handler: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
): MouseEventHandler<HTMLElement> => e => {
  const selection = window.getSelection();

  if (selection && selection.toString().length <= 0) {
    handler(e);
  }
};

export {
  events,
  onEnter,
  onEscape,
  onBackspace,
  stopPropagation,
  letHighlight,
}
