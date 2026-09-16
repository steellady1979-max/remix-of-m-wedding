type PartyRow = { attending: boolean; plus_one: boolean; guests_count: number | null };

export function partySize(row: PartyRow): number {
  if (!row.attending) return 0;
  return Number.isSafeInteger(row.guests_count) && row.guests_count! > 0
    ? row.guests_count! : row.plus_one ? 2 : 1;
}

export function createRsvpRecord(input: {
  attending: boolean; name: string; plusOne: boolean; family: boolean;
  familyCount: number; guestName: string;
}) {
  const { attending, family, plusOne, familyCount } = input;
  if (attending && input.name.trim().length < 2) throw new Error('Name required');
  if (attending && family && (!Number.isSafeInteger(familyCount) || familyCount < 3 || familyCount > 99)) {
    throw new Error('Invalid family size');
  }
  if (attending && !family && plusOne && input.guestName.trim().length < 2) throw new Error('Companion name required');
  return {
    name: attending ? input.name.trim() : 'სამწუხაროდ ვერ',
    attending,
    guests_count: attending ? (family ? familyCount : plusOne ? 2 : 1) : 0,
    plus_one: attending && (plusOne || family),
    notes: !attending ? null : family ? `ოჯახით — სულ ${familyCount} ადამიანი`
      : plusOne ? input.guestName.trim() : null,
  };
}
