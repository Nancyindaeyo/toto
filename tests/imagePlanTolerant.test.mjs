
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseImagePlan } from '../src/imagePlan.js';

const valid = JSON.stringify({
  prompt: '1girl, smile',
  nl: 'a girl smiling',
  flatPrompt: '1girl, smile, solo',
  characters: [{ name: 'Alice', tag: '1girl, alice', nl: 'Alice' }],
  promptFormat: 'nai5-natural',
});

test('plain JSON still parses', () => {
  const plan = parseImagePlan(valid);
  assert.equal(plan.prompt, '1girl, smile');
});

test('whole-text fenced JSON parses', () => {
  const plan = parseImagePlan('```json\n' + valid + '\n```');
  assert.equal(plan.prompt, '1girl, smile');
});

test('prose before and after the JSON (thinking model) parses', () => {
  const text = '让我想想这面镜子的画面……\n考虑构图和人物。\n' + valid + '\n以上就是构思结果。';
  const plan = parseImagePlan(text);
  assert.equal(plan.prompt, '1girl, smile');
});

test('fenced JSON in the middle of prose parses', () => {
  const text = '思考一下：\n```json\n' + valid + '\n```\n完成。';
  const plan = parseImagePlan(text);
  assert.equal(plan.prompt, '1girl, smile');
});

test('braces inside strings do not break balanced extraction', () => {
  const obj = JSON.stringify({ prompt: '1girl, {smile}, solo', nl: 'say } hi', characters: [] });
  const plan = parseImagePlan('前言：\n' + obj);
  assert.equal(plan.prompt, '1girl, {smile}, solo');
});

test('escaped quotes inside strings handled', () => {
  const obj = JSON.stringify({ prompt: 'she said \"hi\", smile', characters: [] });
  const plan = parseImagePlan('analysis...\n' + obj);
  assert.equal(plan.prompt, 'she said "hi", smile');
});

test('prefers the last balanced object when prose contains other braces', () => {
  const text = '配置形如 {temperature: 0.7} 无关。\n最终结果：\n' + valid;
  const plan = parseImagePlan(text);
  assert.equal(plan.prompt, '1girl, smile');
});

test('non-object JSON rejected', () => {
  assert.throws(() => parseImagePlan('[1,2,3]'), /JSON 对象/);
});

test('garbage text rejected', () => {
  assert.throws(() => parseImagePlan('完全不是 JSON 的回答'), /有效 JSON/);
});

test('object without prompt rejected', () => {
  assert.throws(() => parseImagePlan('{"nl":"只有描述"}'), /生图提示词/);
});

test('truncated JSON rejected', () => {
  assert.throws(() => parseImagePlan('{"prompt":"abc","nl":"cut off'), /有效 JSON/);
});

test('non-string input object works (backwards compat)', () => {
  const plan = parseImagePlan({ prompt: '1boy', characters: [] });
  assert.equal(plan.prompt, '1boy');
  assert.equal(plan.promptFormat, 'nai5-natural');
});

test('nai45-tags format preserved', () => {
  const plan = parseImagePlan(JSON.stringify({ prompt: 'tag1', characters: [], promptFormat: 'nai45-tags' }));
  assert.equal(plan.promptFormat, 'nai45-tags');
});
