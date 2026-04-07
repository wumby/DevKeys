import { Shortcut } from "@/types/shortcut";

export type Platform = "mac" | "windows";

type ShortcutStep = string[];

const modifierOrder: Record<string, number> = {
  Ctrl: 0,
  Cmd: 1,
  Option: 2,
  Alt: 2,
  Shift: 3,
};

const keyAliases: Record<string, string> = {
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  ArrowUp: "Up",
  Alt: "Alt",
  Backquote: "`",
  Cmd: "Cmd",
  Command: "Cmd",
  Control: "Ctrl",
  Ctrl: "Ctrl",
  Escape: "Esc",
  Esc: "Esc",
  Meta: "Cmd",
  Option: "Option",
  Return: "Enter",
  Shift: "Shift",
};

function normalizeKeyLabel(key: string, platform: Platform) {
  const trimmedKey = key.trim();

  if (trimmedKey.length === 1) {
    if (/^[a-z]$/i.test(trimmedKey)) {
      return trimmedKey.toUpperCase();
    }

    return trimmedKey;
  }

  const aliasedKey = keyAliases[trimmedKey] ?? trimmedKey;

  if (aliasedKey === "Alt" && platform === "mac") {
    return "Option";
  }

  return aliasedKey;
}

function sortStep(keys: ShortcutStep) {
  return [...keys].sort((left, right) => {
    const leftOrder = modifierOrder[left] ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = modifierOrder[right] ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.localeCompare(right);
  });
}

function normalizeStep(keys: ShortcutStep, platform: Platform) {
  return sortStep(keys.map((key) => normalizeKeyLabel(key, platform)));
}

export function getShortcutSteps(
  shortcut: Shortcut,
  platform: Platform,
): ShortcutStep[] {
  const steps =
    platform === "mac"
      ? shortcut.macSteps ?? [shortcut.macKeys]
      : shortcut.windowsSteps ?? [shortcut.windowsKeys];

  return steps.map((step) => normalizeStep(step, platform));
}

export function getShortcutDisplayText(
  shortcut: Shortcut,
  platform: Platform,
) {
  return getShortcutSteps(shortcut, platform)
    .map((step) => step.join(" + "))
    .join(", then ");
}

export function isModifierKey(key: string) {
  return ["Alt", "Control", "Meta", "Shift"].includes(key);
}

export function eventToStep(
  event: Pick<
    KeyboardEvent,
    "altKey" | "ctrlKey" | "key" | "metaKey" | "shiftKey"
  >,
  platform: Platform,
) {
  if (isModifierKey(event.key)) {
    return null;
  }

  const keys: string[] = [];

  if (event.ctrlKey) {
    keys.push("Ctrl");
  }

  if (event.metaKey) {
    keys.push("Cmd");
  }

  if (event.altKey) {
    keys.push(platform === "mac" ? "Option" : "Alt");
  }

  if (event.shiftKey) {
    keys.push("Shift");
  }

  keys.push(normalizeKeyLabel(event.key, platform));

  return normalizeStep(keys, platform);
}

export function stepsMatch(left: ShortcutStep[], right: ShortcutStep[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((step, index) => {
    const targetStep = right[index];

    if (!targetStep || step.length !== targetStep.length) {
      return false;
    }

    return step.every((key, keyIndex) => key === targetStep[keyIndex]);
  });
}

export function isStepPrefix(candidate: ShortcutStep[], target: ShortcutStep[]) {
  if (candidate.length > target.length) {
    return false;
  }

  return candidate.every((step, index) => {
    const targetStep = target[index];

    if (!targetStep || step.length !== targetStep.length) {
      return false;
    }

    return step.every((key, keyIndex) => key === targetStep[keyIndex]);
  });
}
