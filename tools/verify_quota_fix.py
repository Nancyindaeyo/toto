"""Verify syntax, local import targets and the candidate's regression tests.

Run with Python 3 and Node 20+ from any directory. Baseline parity tests also
need the original ZIP extracted; their environment variables are documented
in the validation report. No dependencies are installed or network used.
"""
from pathlib import Path
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCES = sorted([*ROOT.rglob('*.js'), *ROOT.rglob('*.mjs')])
manifest = json.loads((ROOT / 'manifest.json').read_text())
for path in SOURCES:
    checked = subprocess.run(['node', '--check', str(path)], capture_output=True, text=True)
    if checked.returncode:
        sys.exit(f'{path.relative_to(ROOT)}\n{checked.stderr}')

missing, stale, host = [], [], set()
local_count = 0
for path in SOURCES:
    source = path.read_text()
    for spec in re.findall(r'''(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)["']([^"']+)["']''', source):
        if not spec.startswith('.'):
            continue
        target = (path.parent / spec.split('?')[0]).resolve()
        if target.is_relative_to(ROOT):
            local_count += 1
            if not target.is_file():
                missing.append([str(path.relative_to(ROOT)), spec])
        elif path.suffix == '.js':
            host.add(spec)
        if '?rmv=' in spec and not spec.endswith('?rmv=1.5.51-narrow1'):
            stale.append([str(path.relative_to(ROOT)), spec])

assert manifest['version'] == '1.5.51'
assert manifest['js'] == 'index.js?rmv=1.5.51-narrow1'
for relative, constant in [('index.js', 'RABBIT_MIRROR_RUNTIME_VERSION'), ('src/independentApi.js', 'RUNTIME_VERSION')]:
    assert f"const {constant} = '1.5.51';" in (ROOT / relative).read_text()
result = {'syntax_pass': len(SOURCES), 'internal_imports': local_count, 'missing_imports': missing,
          'stale_imports': stale, 'host_provided': sorted(host), 'manifest_version': manifest['version']}
print(json.dumps(result, ensure_ascii=False, indent=2), flush=True)
if missing or stale:
    sys.exit(1)
tests = sorted((ROOT / 'tests').glob('*.test.mjs'))
sys.exit(subprocess.run(['node', '--experimental-vm-modules', '--test', *map(str, tests)], cwd=ROOT).returncode)
