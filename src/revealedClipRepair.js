export const REVEALED_CLIP_RESCUE_ATTR = 'data-rabbit-mirror-revealed-clip-rescue';

export function parseCssPx(value) {
    const match = String(value ?? '').trim().match(/^(-?(?:\d+\.?\d*|\.\d+))px$/i);
    if (!match) return Number.NaN;
    return Number.parseFloat(match[1]);
}

export function shouldRelaxRevealedClipPanel({
    maxHeightPx,
    heightPx,
    overflowY = '',
    clientHeight = 0,
    scrollHeight = 0,
    protectedSurface = false,
} = {}) {
    if (protectedSurface) return false;
    const clipsY = /(?:hidden|clip)/.test(String(overflowY || '').toLowerCase());
    const scrollH = Number(scrollHeight) || 0;
    const clientH = Number(clientHeight) || 0;
    const maxH = Number(maxHeightPx);
    const height = Number(heightPx);
    if (Number.isFinite(maxH) && maxH > 0 && maxH < 4000 && scrollH > maxH + 2) return true;
    if (Number.isFinite(height) && height > 0 && height < 4000 && scrollH > height + 4) return true;
    return clipsY && scrollH > clientH + 4;
}

function addHost(hosts, seen, element, isInternal) {
    if (!element || seen.has(element) || isInternal(element)) return;
    seen.add(element);
    hosts.push(element);
}

function addOpenDetailsContent(hosts, seen, details, { isInternal, isOuterDetails, isVisible }) {
    if (!details || isOuterDetails(details) || isInternal(details)) return;
    addHost(hosts, seen, details, isInternal);
    for (const child of [...(details.children || [])]) {
        if (String(child.tagName || '').toLowerCase() === 'summary') continue;
        if (!isVisible(child)) continue;
        addHost(hosts, seen, child, isInternal);
    }
}

export function collectRevealedClipHosts(root, {
    isInternal = () => false,
    isOuterDetails = () => false,
    isVisible = () => true,
    lastControl = null,
} = {}) {
    const hosts = [];
    const seen = new Set();
    if (!root) return hosts;

    if (lastControl && (!root.contains || root.contains(lastControl))) {
        const panel = lastControl.closest?.('details, label, li, article, section, fieldset') || lastControl.parentElement;
        if (panel && panel !== root && !isOuterDetails(panel)) addHost(hosts, seen, panel, isInternal);
        for (const sibling of [...(lastControl.parentElement?.children || [])]) {
            if (sibling === lastControl || !isVisible(sibling)) continue;
            addHost(hosts, seen, sibling, isInternal);
        }
        const details = lastControl.matches?.('details') ? lastControl : lastControl.closest?.('details');
        if (details?.open) addOpenDetailsContent(hosts, seen, details, { isInternal, isOuterDetails, isVisible });
    }

    for (const details of root.querySelectorAll?.('details[open]') || []) {
        addOpenDetailsContent(hosts, seen, details, { isInternal, isOuterDetails, isVisible });
    }

    for (const input of root.querySelectorAll?.('input[type="checkbox"]:checked, input[type="radio"]:checked') || []) {
        if (isInternal(input)) continue;
        const host = input.closest?.('label, details, li, section, article, div') || input.parentElement;
        if (host && host !== root && !isOuterDetails(host)) addHost(hosts, seen, host, isInternal);
        for (const sibling of [...(input.parentElement?.children || [])]) {
            if (sibling === input || !isVisible(sibling)) continue;
            addHost(hosts, seen, sibling, isInternal);
        }
    }

    return hosts;
}
