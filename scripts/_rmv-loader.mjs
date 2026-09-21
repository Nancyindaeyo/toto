export async function resolve(specifier, context, nextResolve) {
    const query = specifier.indexOf('?rmv=');
    if (query >= 0) specifier = specifier.slice(0, query);
    return nextResolve(specifier, context);
}
