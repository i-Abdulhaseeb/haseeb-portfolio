// Tiny shared state between the DOM (speech bubble, project cards) and the 3D bot.

export type Expression = "idle" | "happy" | "surprised" | "sleepy";

export const botState = {
  /** Eyes stay closed until the intro is over. */
  awake: false,
  grabbed: false,
  /** 0..1 squash-and-stretch impulse, decays inside the render loop. */
  squash: 0,
  expression: "idle" as Expression,
  expressionUntil: 0,
  /** Pixel position the bot should look at instead of the cursor (e.g. hovered card). */
  lookAt: null as { px: number; py: number } | null,
};

export function setExpression(expression: Expression, ms: number) {
  botState.expression = expression;
  botState.expressionUntil = performance.now() + ms;
}

type Listener = (line: string) => void;
const listeners = new Set<Listener>();

export function say(line: string) {
  listeners.forEach((l) => l(line));
}

export function onSay(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
