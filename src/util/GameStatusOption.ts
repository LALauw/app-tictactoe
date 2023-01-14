const GamesStatusOptions = ["XWin", "OWin", "Draw", "Ongoing"] as const;

export type GamesStatusOption = typeof GamesStatusOptions[number];
