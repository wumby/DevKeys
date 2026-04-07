export type ShortcutCategory =
  | "Must know"
  | "Editing"
  | "Navigation"
  | "Search"
  | "Multi-cursor"
  | "Refactor"
  | "Terminal"
  | "UI";

export type ShortcutDifficulty = "Easy" | "Medium" | "Hard";

export type Shortcut = {
  id: string;
  action: string;
  category: ShortcutCategory;
  description: string;
  macKeys: string[];
  windowsKeys: string[];
  macSteps?: string[][];
  windowsSteps?: string[][];
  difficulty: ShortcutDifficulty;
};
