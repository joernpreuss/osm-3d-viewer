export const THEME_CHOICES = ["system", "light", "dark"] as const;

export type ThemeChoice = (typeof THEME_CHOICES)[number];
export type Theme = "light" | "dark";

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return THEME_CHOICES.includes(value as ThemeChoice);
}

export function resolveTheme(
  choice: ThemeChoice,
  systemPrefersDark: boolean,
): Theme {
  if (choice === "system") {
    return systemPrefersDark ? "dark" : "light";
  }
  return choice;
}
