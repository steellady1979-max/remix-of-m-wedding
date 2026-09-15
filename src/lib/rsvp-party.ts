type PartyRow = { attending: boolean; plus_one: boolean; plus_one_name: string | null };

// A readable marker fits the existing companion field and admin RPC, so one
// household stays one RSVP without a schema migration or extra database writes.
export function familyLabel(count: number) {
  if (!Number.isSafeInteger(count) || count < 3 || count > 99) {
    throw new Error("Invalid family size");
  }
  return `ოჯახით — სულ ${count} ადამიანი`;
}

export function familySize(row: PartyRow): number | null {
  if (!row.attending || !row.plus_one) return null;
  const match = /^ოჯახით — სულ ([1-9]\d?) ადამიანი$/.exec(row.plus_one_name ?? "");
  const count = match ? Number(match[1]) : 0;
  return count >= 3 && count <= 99 ? count : null;
}

export function partySize(row: PartyRow): number {
  return row.attending ? (familySize(row) ?? (row.plus_one ? 2 : 1)) : 0;
}
