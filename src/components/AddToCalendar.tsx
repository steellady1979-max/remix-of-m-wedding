const calendarParameters = new URLSearchParams({
  action: "TEMPLATE",
  text: "გოგა და ლიკას ქორწილი",
  // All-day event: the schedule has a start time but no confirmed end time.
  dates: "20260922/20260923",
  ctz: "Asia/Tbilisi",
  location: "საჯვაროს ეკლესია; რესტორანი ბაგრატიონი, ზუგდიდი",
  details: [
    "22 სექტემბერი 2026 — გოგა და ლიკას ქორწილი",
    "13:00 — ჯვრისწერა, საჯვაროს ეკლესია",
    "15:00 — ხელის მოწერის ცერემონია, სოფ. კახათი",
    "18:00 — სტუმრების მიღება",
    "სახლის რუკა: https://www.google.com/maps?q=42.499073,41.888233",
    "19:00 — ვახშამი, რესტორანი ბაგრატიონი",
    "21:00 — ტორტის გაჭრა",
    "დრო მითითებულია საქართველოს დროით (Asia/Tbilisi).",
    "მოსაწვევი და რუკები: https://goga-lika.vercel.app/",
  ].join("\n"),
});

export function AddToCalendar() {
  return (
    <a
      href={`https://calendar.google.com/calendar/render?${calendarParameters}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-olive/40 px-5 py-3 text-sm text-olive transition-colors hover:bg-olive-mist focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
      aria-label="დაამატე კალენდარში — Google Calendar"
    >
      დაამატე კალენდარში
    </a>
  );
}
