import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addMonths, isValidISODate, monthRange, toISODate } from './dates.ts';
import { buildReport, parseAmount } from './report.ts';

const cats = [
  { id: 'f', name: 'Food', color: '#f00' },
  { id: 't', name: 'Transport', color: '#0f0' },
];
const exps = [
  { id: '1', categoryId: 'f', amount: 10, date: '2026-10-01' },
  { id: '2', categoryId: 'f', amount: 5.5, date: '2026-10-31' },
  { id: '3', categoryId: 't', amount: 20, date: '2026-10-15' },
  { id: '4', categoryId: 't', amount: 99, date: '2026-09-30' },
  { id: '5', categoryId: 'gone', amount: 1, date: '2026-10-02' },
];

test('report for a month is inclusive and grouped', () => {
  const { from, to } = monthRange(new Date(2026, 9, 10));
  assert.deepEqual([from, to], ['2026-10-01', '2026-10-31']);
  const r = buildReport(exps, cats, from, to);
  assert.equal(r.total, 36.5);
  assert.equal(r.count, 4);
  assert.deepEqual(r.byCategory.map((c) => c.name), ['Transport', 'Food', 'Uncategorized']);
  assert.equal(r.expenses[0].id, '2');
});

test('custom period', () => {
  const r = buildReport(exps, cats, '2026-09-30', '2026-10-01');
  assert.equal(r.total, 109);
});

test('month helpers', () => {
  assert.equal(toISODate(addMonths(new Date(2026, 0, 31), -1)), '2025-12-01');
  assert.ok(isValidISODate('2026-02-28'));
  assert.ok(!isValidISODate('2026-02-30'));
});

test('parseAmount', () => {
  assert.equal(parseAmount('12,345'), 12.35);
  assert.equal(parseAmount('0'), null);
  assert.equal(parseAmount('abc'), null);
  assert.equal(parseAmount('-3'), null);
});
