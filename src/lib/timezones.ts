export const timezones = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland',
  'Africa/Cairo',
  'Asia/Dubai',
  'America/Chicago',
  'America/Toronto',
  'Europe/Berlin',
  'Asia/Hong_Kong',
  'Asia/Shanghai',
  'America/Sao_Paulo',
  'Africa/Johannesburg',
  'Asia/Seoul',
  'Europe/Moscow',
];

export const getTimezoneOptions = () => {
  return timezones.map(tz => ({
    value: tz,
    label: tz.replace('_', ' '),
  }));
};