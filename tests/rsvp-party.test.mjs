import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRsvpRecord, partySize } from '../src/lib/rsvp-party.ts';
const base = { attending: true, name: ' Guest ', plusOne: false, family: false, familyCount: 4, guestName: ' Companion ' };
test('RSVP payload uses the confirmed database columns for each attendance option', () => {
  for (const [options, count, notes] of [[{},1,null],[{plusOne:true},2,'Companion'],[{family:true,familyCount:6},6,'ოჯახით — სულ 6 ადამიანი'],[{attending:false},0,null]]) {
    const row=createRsvpRecord({...base,...options});
    assert.deepEqual(Object.keys(row).sort(), ['attending','guests_count','name','notes','plus_one']);
    assert.equal(row.guests_count,count);
    assert.equal(row.notes,notes);
    assert.equal(partySize(row),count);
  }
});
test('invalid family counts do not reach the database', () => {
  for (const familyCount of [2,100,3.5,NaN]) assert.throws(()=>createRsvpRecord({...base,family:true,familyCount}));
});
