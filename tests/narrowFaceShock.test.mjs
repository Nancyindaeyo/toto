import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// These tests execute the production repair and geometry functions with a
// deliberately simulated DOM/geometry boundary. They are not browser rendering,
// Safari or TT device tests. The 227/366 fixture is the historical narrow-face
// geometry recorded by the project's independentExternalAutoRootWidth test.
function readIndependentApiSource(name) {
    return readFileSync(new URL(`../src/independentApi/${name}`, import.meta.url), 'utf8');
}
const geometrySource = readIndependentApiSource('geometry.js');
const connectionSource = readIndependentApiSource('connection.js');
const requestSource = readIndependentApiSource('request.js');
const persistedRuntimeUiSelector = geometrySource.match(/^const PERSISTED_RUNTIME_UI_SELECTOR = .*;$/m);
assert.ok(persistedRuntimeUiSelector, 'PERSISTED_RUNTIME_UI_SELECTOR missing from geometry.js');
function sourceBlock(source, startMarker, endMarker) {
    const start = source.indexOf(startMarker);
    assert.ok(start >= 0, `${startMarker} source block missing`);
    const end = endMarker == null ? source.length : source.indexOf(endMarker, start + startMarker.length);
    assert.ok(end > start, `${endMarker || 'EOF'} end marker missing after ${startMarker}`);
    return source.slice(start, end).replace(/^export /gm, '');
}

class StyleDeclaration {
    constructor(text = '') { this.cssText = text; }
    set cssText(text) {
        this.values = new Map();
        for (const part of String(text).split(';')) {
            const colon = part.indexOf(':');
            if (colon < 0) continue;
            const key = part.slice(0, colon).trim();
            const value = part.slice(colon + 1).trim();
            if (key) this.values.set(key, [value.replace(/\s*!important\s*$/, ''), /!important\s*$/.test(value) ? 'important' : '']);
        }
    }
    get cssText() { return [...this.values].map(([key, [value, priority]]) => `${key}: ${value}${priority ? ' !important' : ''};`).join(' '); }
    getPropertyValue(key) { return this.values.get(key)?.[0] || ''; }
    getPropertyPriority(key) { return this.values.get(key)?.[1] || ''; }
    setProperty(key, value, priority = '') { this.values.set(key, [String(value), String(priority)]); }
    removeProperty(key) { const value = this.getPropertyValue(key); this.values.delete(key); return value; }
}
const dataKey = name => name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
class Element {
    constructor(tagName, { style = '', width = 0, left = 0 } = {}) {
        this.tagName = tagName.toUpperCase();
        this.nodeType = 1;
        this.dataset = {};
        this.style = new StyleDeclaration(style);
        this.attrs = new Map();
        this.children = [];
        this.parentElement = null;
        this.isConnected = true;
        this.hidden = false;
        this.id = '';
        this.classList = [];
        this.width = width;
        this.left = left;
        this.listeners = new Map();
    }
    append(...children) { for (const child of children) { child.parentElement = this; this.children.push(child); } }
    get attributes() { return [...this.attrs].map(([name, value]) => ({ name, value })); }
    getAttribute(name) {
        if (name === 'style') return this.style.cssText || null;
        if (name.startsWith('data-')) return this.dataset[dataKey(name)] ?? this.attrs.get(name) ?? null;
        return this.attrs.get(name) ?? null;
    }
    setAttribute(name, value) {
        if (name === 'style') this.style.cssText = value;
        else if (name.startsWith('data-')) this.dataset[dataKey(name)] = String(value);
        else this.attrs.set(name, String(value));
    }
    hasAttribute(name) { return this.getAttribute(name) !== null; }
    removeAttribute(name) {
        if (name === 'style') this.style.cssText = '';
        else if (name.startsWith('data-')) delete this.dataset[dataKey(name)];
        else this.attrs.delete(name);
    }
    contains(node) { return node === this || this.children.some(child => child.contains(node)); }
    matches(selector) {
        if (selector === 'details') return this.tagName === 'DETAILS';
        if (selector === '.mes_text') return this.classList.includes('mes_text');
        if (selector === '.story') return this.classList.includes('story');
        const attr = /^\[([^=\]]+)(?:="([^"]*)")?\]$/.exec(selector);
        return attr ? this.hasAttribute(attr[1]) && (attr[2] === undefined || this.getAttribute(attr[1]) === attr[2]) : false;
    }
    closest(selector) { for (let node = this; node; node = node.parentElement) if (node.matches(selector)) return node; return null; }
    querySelectorAll(selector) {
        const descendants = this.children.flatMap(child => [child, ...child.querySelectorAll('*')]);
        if (selector === '*') return descendants;
        if (selector === 'style') return descendants.filter(node => node.tagName === 'STYLE');
        return descendants.filter(node => node.matches(selector));
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    getBoundingClientRect() {
        const width = this.measureWidth ? this.measureWidth() : this.width;
        return { left: this.left, right: this.left + width, top: 0, bottom: 640, width, height: 640 };
    }
    get clientWidth() { return this.getBoundingClientRect().width; }
    get clientLeft() { return 0; }
    addEventListener(name, callback) { this.listeners.set(name, callback); }
    click() { this.listeners.get('click')?.(); }
}

function fixture({ placement = 'external', authoredStyle = 'padding: 12px;', bodyWidth = 227,
    fillingWidth = 366, floatMode = 'none', position = 'relative', display = 'block',
    open = true, connected = true, projected = false, hostSource = 'independent', shellWidth = 366 } = {}) {
    const chat = { key: 'chat:one', chat: [{ is_user: false, is_system: false, mes: 'unchanged message', swipe_id: 0, sourceHash: 'source:one' }] };
    const container = new Element('div', { width: 440 });
    const message = new Element('div', { width: 440 });
    const lane = new Element('div', { width: 366, left: 37 });
    const messageText = new Element('div', { width: 227, left: 37 });
    messageText.classList = ['mes_text'];
    container.append(message);
    message.append(lane);
    lane.append(messageText);
    const projectedContainer = projected ? new Element('div', { width: 440 }) : container;
    const host = placement === 'follow-inline' ? null : new Element('section', { width: shellWidth, left: 37 });
    const details = new Element('details', { width: shellWidth, left: 37 });
    details.open = open;
    const summary = new Element('summary', { width: shellWidth });
    const body = new Element('div', { style: authoredStyle, width: bodyWidth });
    body.classList = ['story'];
    body.measureWidth = () => body.style.getPropertyValue('width') === '100%' ? fillingWidth : bodyWidth;
    const input = new Element('input');
    input.checked = true;
    const button = new Element('button');
    let clickCount = 0;
    button.addEventListener('click', () => { clickCount += 1; });
    body.append(input, button);
    details.append(summary, body);
    const sibling = new Element('details', { width: 366 });
    sibling.open = true;
    const siblingBody = new Element('div', { style: 'width: 260px; color: teal;', width: 260 });
    sibling.append(new Element('summary'), siblingBody);
    if (host) {
        host.setAttribute('data-rabbit-mirror-external-source', 'true');
        Object.assign(host.dataset, { rmSource: hostSource, rmState: 'ready', rmPlacement: placement,
            rmOwnerChat: chat.key, rmOwnerMesid: '0', rmOwnerSwipe: '0', rmSourceHash: 'source:one',
            rmKey: `${chat.key}:0:0:source:one` });
        Object.assign(details.dataset, { rabbitMirrorExternalDetails: 'true', rabbitMirrorOwnerChat: chat.key,
            rabbitMirrorOwnerMesid: '0', rabbitMirrorOwnerSwipe: '0', rabbitMirrorOwnerSourceHash: 'source:one',
            rabbitMirrorOwnerKey: `${chat.key}:0:0:source:one` });
        host.append(details, sibling);
        (placement === 'inline' ? messageText : projectedContainer).append(host);
        details.measureWidth = () => Number.parseFloat(host.style.getPropertyValue('--rm-external-lane-width')) || shellWidth;
    } else {
        messageText.append(details, sibling);
    }
    details.isConnected = connected;
    body.isConnected = connected;
    const state = { owner: message, projectedParent: projectedContainer, hostBeforeOwner: false };
    let forbiddenCalls = 0;
    const forbidden = () => { forbiddenCalls += 1; throw new Error('A narrow-face repair must not send, schedule or persist'); };
    const sandbox = {
        console: { debug() {} },
        navigator: { userAgent: 'iPhone' }, innerWidth: 440,
        visualViewport: { width: 440 }, screen: { width: 440 },
        document: { documentElement: { clientWidth: 440 } },
        getComputedStyle(element, pseudo) {
            if (pseudo === '::details-content') return { inlineSize: '366px', width: '366px' };
            return { display: element.hidden ? 'none' : (element.style.getPropertyValue('display') || (element === body ? display : 'block')), position: element === body ? position : 'static',
                cssFloat: element === body ? floatMode : 'none', marginLeft: '0px', marginRight: '0px',
                visibility: element.hidden ? 'hidden' : 'visible',
                paddingLeft: '0px', paddingRight: '0px', borderLeftWidth: '0px', borderRightWidth: '0px' };
        },
        getContext: () => chat,
        chatKey: context => context.key,
        swipeId: msg => Number(msg?.swipe_id || 0),
        messageSourceFingerprint: msg => msg?.sourceHash || '',
        isRabbitMirrorEligibleAssistantMessage: msg => !!msg && !msg.is_user && !msg.is_system,
        messageElement: () => state.owner,
        messageElementForExternalHost: () => state.owner,
        messageBody: element => element?.querySelector('.mes_text') || element,
        getRabbitMirrorExternalPlacementParent: () => projected ? state.projectedParent : null,
        isRabbitMirrorManagedChatSurface: () => projected,
        externalHostAppearsBeforeOwner: () => state.hostBeforeOwner,
        externalFaceDetails: element => element.children.filter(child => child.tagName === 'DETAILS'),
        clearIndependentExternalCompactShellWidth(element) { element.style.removeProperty('--rm-external-compact-width'); },
        fetch: forbidden, setTimeout: forbidden, requestAnimationFrame: forbidden,
        localStorage: { setItem: forbidden, removeItem: forbidden, clear: forbidden },
        sourceNode: details,
    };
    vm.createContext(sandbox);
    vm.runInContext([
        "const SOURCE_ATTR='data-rabbit-mirror-external-source';",
        persistedRuntimeUiSelector[0],
        'let externalGeometryCycleSequence=0, externalGeometryLifecycleEpoch=0, externalGeometryLifecycleReason="";',
        'const externalGeometryOwnerNodes=new WeakMap();',
        sourceBlock(connectionSource, 'function messageBaseSlotKey(', 'function legacyMessageSourceFingerprints('),
        sourceBlock(connectionSource, 'function recordKey(', 'function baseSlotOf('),
        sourceBlock(requestSource, 'const EXTERNAL_GEOMETRY_CYCLE_VERSION=', 'function textFromContent('),
        sourceBlock(requestSource, 'function clearExternalHostGeometryTokens(', null),
        sourceBlock(geometrySource, 'function applyMobileExternalHostGeometryPlan(', 'function scheduleExternalHostGeometryFinalConfirm('),
        sourceBlock(geometrySource, 'function remeasureRabbitMirrorFaceGeometry(', 'function externalHostGeometrySettledForOwner('),
        sourceBlock(geometrySource, 'const INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR=', 'function applyMobileExternalHostGeometryPlan('),
        sourceBlock(geometrySource, 'function captureIndependentContentWidthBaseline(', null),
        'globalThis.api={remeasureRabbitMirrorFaceGeometry,repairRabbitMirrorFaceAutoWidth,undoRabbitMirrorFaceAutoWidth};',
    ].join('\n'), sandbox);
    return { ...sandbox.api, chat, state, host, details, body, summary, sibling, siblingBody, lane,
        input, button, clickCount: () => clickCount, forbiddenCalls: () => forbiddenCalls, sandbox };
}

for (const mode of [
    { name: 'cloud or local independent external', placement: 'external' },
    { name: 'independent inline', placement: 'inline' },
    { name: 'follow inline', placement: 'follow-inline' },
    { name: 'TT projected external', placement: 'external', projected: true },
]) {
    test(`simulated ${mode.name}: current 227px automatic body expands to 366px without replacing DOM`, () => {
        const f = fixture(mode);
        const identities = [f.details, f.body, f.input, f.button, f.sibling, f.siblingBody];
        const siblingStyle = f.siblingBody.style.cssText;
        const result = f.repairRabbitMirrorFaceAutoWidth(f.details);
        assert.equal(result.status, 'repaired');
        assert.equal(result.beforeWidth, 227);
        assert.equal(result.afterWidth, 366);
        assert.equal(f.body.getBoundingClientRect().width, 366);
        assert.deepEqual([f.details, f.body, f.input, f.button, f.sibling, f.siblingBody], identities);
        assert.equal(f.details.children[1], f.body);
        assert.equal(f.body.children[0], f.input);
        assert.equal(f.input.checked, true);
        f.button.click();
        assert.equal(f.clickCount(), 1);
        assert.equal(f.siblingBody.style.cssText, siblingStyle);
        assert.equal(f.forbiddenCalls(), 0);
    });
}

for (const authoredStyle of ['width: 260px; color: teal;', 'width: fit-content; color: teal;', 'inline-size: 260px;', 'max-width: 260px;']) {
    test(`author sizing is retained: ${authoredStyle}`, () => {
        const f = fixture({ authoredStyle, bodyWidth: 260 });
        const before = f.body.style.cssText;
        const result = f.repairRabbitMirrorFaceAutoWidth(f.details);
        assert.notEqual(result.status, 'repaired');
        assert.equal(f.body.style.cssText, before);
        assert.equal(f.body.getBoundingClientRect().width, 260);
    });
}

test('author width in a matching stylesheet remains protected', () => {
    const f = fixture();
    const style = new Element('style');
    style.sheet = { cssRules: [{ selectorText: '.story', style: new StyleDeclaration('width: 260px;') }] };
    f.details.append(style);
    const before = f.body.style.cssText;
    const result = f.repairRabbitMirrorFaceAutoWidth(f.details);
    assert.notEqual(result.status, 'repaired');
    assert.equal(f.body.style.cssText, before);
});

test('hidden radio before the single visible body does not become the width repair target', () => {
    const f = fixture();
    const radio = new Element('input', { style: 'display: none;' });
    radio.type = 'radio';
    radio.setAttribute('type', 'radio');
    radio.checked = true;
    radio.parentElement = f.details;
    f.details.children.splice(1, 0, radio);
    const radioBefore = radio.style.cssText;
    const bodyBefore = f.body.style.cssText;
    assert.equal(f.repairRabbitMirrorFaceAutoWidth(f.details).status, 'repaired');
    assert.equal(f.body.getBoundingClientRect().width, 366);
    assert.equal(radio.style.cssText, radioBefore);
    assert.equal(radio.checked, true);
    assert.equal(f.undoRabbitMirrorFaceAutoWidth(f.details), true);
    assert.equal(f.body.style.cssText, bodyBefore);
});

test('multiple visible content roots are not guessed or widened', () => {
    const f = fixture();
    const anotherBody = new Element('div', { style: 'color: plum;', width: 180 });
    f.details.append(anotherBody);
    const bodyBefore = f.body.style.cssText;
    const anotherBefore = anotherBody.style.cssText;
    assert.equal(f.repairRabbitMirrorFaceAutoWidth(f.details).status, 'protected');
    assert.equal(f.body.style.cssText, bodyBefore);
    assert.equal(anotherBody.style.cssText, anotherBefore);
});

test('manual body resolution remains bounded when there are more than 64 direct children', () => {
    const f = fixture();
    for (let index = 0; index < 64; index += 1) {
        const radio = new Element('input', { style: 'display: none;' });
        radio.type = 'radio';
        radio.setAttribute('type', 'radio');
        f.details.append(radio);
    }
    const before = f.body.style.cssText;
    assert.equal(f.repairRabbitMirrorFaceAutoWidth(f.details).status, 'protected');
    assert.equal(f.body.style.cssText, before);
});

for (const constraint of [{ floatMode: 'left' }, { position: 'absolute' }, { position: 'fixed' }]) {
    test(`floating or spatial content remains unchanged: ${JSON.stringify(constraint)}`, () => {
        const f = fixture(constraint);
        const before = f.body.style.cssText;
        assert.notEqual(f.repairRabbitMirrorFaceAutoWidth(f.details).status, 'repaired');
        assert.equal(f.body.style.cssText, before);
    });
}

test('a width write without actual expansion is rolled back with original style and priority', () => {
    const f = fixture({ fillingWidth: 227, authoredStyle: 'padding: 12px !important; color: teal;' });
    const before = f.body.style.cssText;
    const result = f.repairRabbitMirrorFaceAutoWidth(f.details);
    assert.notEqual(result.status, 'repaired');
    assert.equal(f.body.style.cssText, before);
    assert.equal(f.body.style.getPropertyPriority('padding'), 'important');
    assert.equal(f.body.getBoundingClientRect().width, 227);
});

test('manual undo restores only width repair and preserves checked state and listeners', () => {
    const f = fixture();
    const before = f.body.style.cssText;
    assert.equal(f.repairRabbitMirrorFaceAutoWidth(f.details).status, 'repaired');
    assert.equal(f.undoRabbitMirrorFaceAutoWidth(f.details), true);
    assert.equal(f.body.style.cssText, before);
    assert.equal(f.input.checked, true);
    f.button.click();
    assert.equal(f.clickCount(), 1);
});

test('a repeated electric repair neither grows again nor replaces the original undo snapshot', () => {
    const f = fixture();
    const before = f.body.style.cssText;
    assert.equal(f.repairRabbitMirrorFaceAutoWidth(f.details).status, 'repaired');
    const repaired = f.body.style.cssText;
    assert.equal(f.repairRabbitMirrorFaceAutoWidth(f.details).status, 'unchanged');
    assert.equal(f.body.style.cssText, repaired);
    assert.equal(f.undoRabbitMirrorFaceAutoWidth(f.details), true);
    assert.equal(f.body.style.cssText, before);
});

for (const unavailable of [{ open: false }, { connected: false }]) {
    test(`closed or detached face is not changed: ${JSON.stringify(unavailable)}`, () => {
        const f = fixture({ ...unavailable, shellWidth: 227 });
        const beforeBody = f.body.style.cssText;
        const beforeHost = f.host.style.cssText;
        assert.notEqual(f.repairRabbitMirrorFaceAutoWidth(f.details).status, 'repaired');
        assert.notEqual(f.remeasureRabbitMirrorFaceGeometry(f.details).status, 'remeasured');
        assert.equal(f.body.style.cssText, beforeBody);
        assert.equal(f.host.style.cssText, beforeHost);
    });
}

for (const projected of [false, true]) {
    test(`manual geometry remeasure uses current structural 366px lane (projected=${projected})`, () => {
        const f = fixture({ shellWidth: 227, projected });
        f.host.style.setProperty('--rm-external-compact-width', '227px');
        const otherHost = new Element('section', { style: '--rm-external-lane-width: 260px;' });
        f.host.parentElement.append(otherHost);
        const otherStyle = otherHost.style.cssText;
        const result = f.remeasureRabbitMirrorFaceGeometry(f.details);
        assert.equal(result.status, 'remeasured');
        assert.equal(result.beforeWidth, 227);
        assert.equal(result.afterWidth, 366);
        assert.equal(f.host.style.getPropertyValue('--rm-external-lane-width'), '366px');
        assert.equal(f.host.style.getPropertyValue('--rm-external-compact-width'), '');
        assert.equal(otherHost.style.cssText, otherStyle);
        assert.equal(f.forbiddenCalls(), 0);
    });
}

for (const [name, mutate, expectedStatus] of [
    ['chat switched', f => { f.chat.key = 'chat:two'; }, 'stale'],
    ['swipe switched', f => { f.chat.chat[0].swipe_id = 1; }, 'stale'],
    ['source replaced', f => { f.chat.chat[0].sourceHash = 'source:two'; }, 'stale'],
    ['face owner stamp changed', f => { f.details.dataset.rabbitMirrorOwnerMesid = '1'; }, 'stale'],
    ['owner message detached', f => { f.state.owner.isConnected = false; }, 'unavailable'],
    ['TT placement parent changed', f => { f.state.projectedParent = new Element('div', { width: 440 }); }, 'stale'],
    ['TT placement parent unavailable', f => { f.state.projectedParent = null; }, 'unavailable'],
    ['generation still pending', f => { f.host.dataset.rmPending = 'true'; }, 'unavailable'],
]) {
    test(`geometry remeasure refuses stale ownership: ${name}`, () => {
        const f = fixture({ shellWidth: 227, projected: true });
        const beforeStyle = f.host.style.cssText;
        mutate(f);
        const beforeData = JSON.stringify(f.host.dataset);
        const result = f.remeasureRabbitMirrorFaceGeometry(f.details);
        assert.equal(result.status, expectedStatus);
        assert.equal(f.host.style.cssText, beforeStyle);
        assert.equal(JSON.stringify(f.host.dataset), beforeData);
        assert.equal(f.forbiddenCalls(), 0);
    });
}

test('geometry without actual widening is not reported as repaired', () => {
    const f = fixture({ shellWidth: 366 });
    const result = f.remeasureRabbitMirrorFaceGeometry(f.details);
    assert.equal(result.status, 'unavailable');
    assert.equal(result.beforeWidth, 366);
    assert.equal(result.afterWidth, 366);
    assert.equal(f.forbiddenCalls(), 0);
});

test('ordinary host positioned before its owner is rejected without moving it', () => {
    const f = fixture({ shellWidth: 227 });
    f.state.hostBeforeOwner = true;
    const parent = f.host.parentElement;
    const beforeStyle = f.host.style.cssText;
    assert.equal(f.remeasureRabbitMirrorFaceGeometry(f.details).status, 'stale');
    assert.equal(f.host.parentElement, parent);
    assert.equal(f.host.style.cssText, beforeStyle);
});

test('an invalid structural lane yields unavailable without applying fallback geometry', () => {
    const f = fixture({ shellWidth: 227 });
    f.lane.width = 100;
    const beforeStyle = f.host.style.cssText;
    const beforeData = JSON.stringify(f.host.dataset);
    const result = f.remeasureRabbitMirrorFaceGeometry(f.details);
    assert.equal(result.status, 'unavailable');
    assert.equal(f.host.style.cssText, beforeStyle);
    assert.equal(JSON.stringify(f.host.dataset), beforeData);
    assert.equal(f.forbiddenCalls(), 0);
});
