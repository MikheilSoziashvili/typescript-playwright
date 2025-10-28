import { OriginalGame } from "@enums/original-games";

export class OriginalsDomainData {
	public readonly allGames: OriginalGame[] = Object.values(OriginalGame);

	/**
	 * Returns all Originals games except those explicitly excluded.
	 *
	 * Useful for running broad test suites while skipping known unstable,
	 * unsupported, or irrelevant games.
	 *
	 * @param exclude - One or more {@link OriginalGame} values to exclude.
	 * @returns An array of {@link OriginalGame} entries excluding the specified ones.
	 */
	public allGamesExcluding(...exclude: OriginalGame[]): OriginalGame[] {
		return this.allGames.filter((game) => !exclude.includes(game));
	}

	/**
	 * Returns only the Originals games explicitly included.
	 *
	 * Useful for focused or smoke test subsets that target a specific
	 * set of Originals (e.g. Keno and Plinko only).
	 *
	 * @param include - One or more {@link OriginalGame} values to include.
	 * @returns An array of {@link OriginalGame} entries matching the specified ones.
	 */
	public allGamesIncluding(...include: OriginalGame[]): OriginalGame[] {
		return this.allGames.filter((game) => include.includes(game));
	}
}
