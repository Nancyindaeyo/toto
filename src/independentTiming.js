// Timing belongs to the independent API only. Legacy flags are consulted only
// when no explicit three-way preference has been saved.
export function independentGenerationTiming(settings = {}) {
    const value = settings?.independentGenerationTiming;
    if (value === 'auto' || value === 'manual' || value === 'off') return value;
    return settings?.enabled === false || settings?.autoRabbitMirrorInjection === false || settings?.mode === 'off'
        ? 'off' : 'auto';
}
