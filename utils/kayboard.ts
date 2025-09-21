export function keyboardClick(key: string) {
  const event = new KeyboardEvent("keydown", { key });
  window.dispatchEvent(event);
}
