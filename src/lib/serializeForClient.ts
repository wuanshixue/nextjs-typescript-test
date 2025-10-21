// typescript
export function serializeForClient(value: unknown): unknown {
    if (value === null || value === undefined) return value;

    const t = typeof value;
    if (t === "string" || t === "number" || t === "boolean") return value;

    if (value instanceof Date) return value.toISOString();

    if (value instanceof Error) {
        return {
            __type: "Error",
            name: value.name,
            message: value.message,
            stack: value.stack,
        };
    }

    if (value instanceof Map) {
        return {
            __type: "Map",
            entries: Array.from((value as Map<unknown, unknown>).entries()).map(
                ([k, v]) => [serializeForClient(k), serializeForClient(v)]
            ),
        };
    }

    if (value instanceof Set) {
        return {
            __type: "Set",
            values: Array.from((value as Set<unknown>).values()).map(
                (v) => serializeForClient(v)
            ),
        };
    }

    if (Array.isArray(value)) {
        return (value as unknown[]).map((v) => serializeForClient(v));
    }

    const proto = Object.getPrototypeOf(value);
    if (proto && proto !== Object.prototype) {
        const plain: Record<string, unknown> = {};
        for (const key of Object.keys(value as Record<string, unknown>)) {
            const v = (value as Record<string, unknown>)[key];
            if (typeof v !== "function") plain[key] = serializeForClient(v);
        }
        plain.__class =
            ((value as { constructor?: { name?: string } }).constructor?.name) ??
            undefined;
        return plain;
    }

    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        out[k] = serializeForClient(v);
    }
    return out;
}
