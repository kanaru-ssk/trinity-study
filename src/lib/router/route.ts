/** パスの 1 セグメント（= routes 以下のディレクトリ 1 つ） */
export type Segment = {
	kind: "static" | "param" | "catchAll"; // articles | [id] | [...slug]
	name: string;
};

export type ParsedRoute = {
	segments: Segment[];
	path: string;
};

const toSegment = (dir: string): Segment => {
	const catchAll = dir.match(/^\[\.\.\.(.+)\]$/);
	if (catchAll) return { kind: "catchAll", name: catchAll[1] };
	const param = dir.match(/^\[(.+)\]$/);
	if (param) return { kind: "param", name: param[1] };
	return { kind: "static", name: dir };
};

const toHonoSegment = ({ kind, name }: Segment): string =>
	kind === "static" ? name : kind === "param" ? `:${name}` : `:${name}{.+}`;

/**
 * routes からの相対パスを Hono のパスに変換する。
 * - `index.tsx` → `/`
 * - `articles/[id]/index.tsx` → `/articles/:id`
 * - `docs/[...slug]/index.tsx` → `/docs/:slug{.+}`
 */
export const parseRoute = (file: string): ParsedRoute => {
	const segments = file.split("/").slice(0, -1).map(toSegment); // 末尾の index.tsx を除く
	return { segments, path: `/${segments.map(toHonoSegment).join("/")}` };
};

const RANK = { static: 0, param: 1, catchAll: 2 } as const;

/** Hono は先に登録したルートを優先するため、左のセグメントから「固定 → パラメータ → catch-all」の順に並べる */
export const compareRoutes = (a: ParsedRoute, b: ParsedRoute): number => {
	const length = Math.min(a.segments.length, b.segments.length);
	for (let i = 0; i < length; i++) {
		const diff = RANK[a.segments[i].kind] - RANK[b.segments[i].kind];
		if (diff !== 0) return diff;
	}
	return 0;
};

/** 同じ URL にマッチするルート（`[id]` と `[slug]` など）は同じキーになる */
export const conflictKey = (segments: Segment[]): string =>
	segments
		.map(({ kind, name }) =>
			kind === "static" ? name : kind === "param" ? ":" : "*",
		)
		.join("/");
