export const formatMoney = (n, c, d, t) => {
  c = isNaN((c = Math.abs(c))) ? 2 : c;
  d = d === undefined ? '.' : d;
  t = t === undefined ? ',' : t;
  let s = n < 0 ? '-' : '';
  let i = ((n = Math.abs(Number(n) || 0).toFixed(c)) | 0) + '';
  let j = i.length > 3 ? i.length % 3 : 0;

  return (
    s +
    (j ? i.substr(0, j) : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  );
};

export const formatTimer = n => {
  let s = Number(n) | 0,
    m = Number(s / 60) | 0,
    h = Number(m / 60) | 0,
    d = Number(h / 24) | 0,
    M = Number(d / 30) | 0,
    w = M > 0 ? 0 : Number(d / 7) | 0;

  if (n <= 0) return '';

  s -= m * 60;
  m -= h * 60;
  h -= d * 24;
  d -= M * 30 + w * 7;

  return (
    (M > 0 ? M + 'M ' : w > 0 ? w + 'W ' : '') +
    (d > 0 ? d + 'D ' : '') +
    ('0' + h).slice(-2) +
    ':' +
    ('0' + m).slice(-2) +
    ':' +
    ('0' + s).slice(-2)
  );
};

export const formatTime = (n, isLittle = false) => {
  let s = Number(n | 0),
    m = Number(s / 60) | 0,
    h = Number(m / 60) | 0,
    d = Number(h / 24) | 0,
    M = Number(d / 30) | 0,
    w = M > 0 ? 0 : Number(d / 7) | 0;

  if (n <= 0) return '';

  s -= m * 60;
  m -= h * 60;
  h -= d * 24;
  d -= M * 30 + w * 7;

  if (isLittle) {
    return (
      (M > 0
        ? M + ' month' + (M > 1 ? 's' : '') + ' '
        : w > 0
          ? w + ' week' + (w > 1 ? 's' : '') + ' '
          : '') +
      (d > 0 ? d + ' day' + (d > 1 ? 's' : '') + ' ' : '') +
      (h > 0 ? h + ' hour' + (h > 1 ? 's' : '') + ' ' : '') +
      (m > 0 ? m + ' min' + (m > 1 ? 's' : '') + ' ' : '') +
      (s > 0 ? s + ' s' : '')
    );
  }

  return (
    (M > 0 ? M + ' month' + (M > 1 ? 's' : '') + ' ' : w > 0 ? w + ' week' + (w > 1 ? 's' : '') + ' ' : '') +
    (d > 0 ? d + ' day' + (d > 1 ? 's' : '') + ' ' : '') +
    (h > 0 ? h + ' hour' + (h > 1 ? 's' : '') + ' ' : '') +
    (m > 0 ? m + ' minute' + (m > 1 ? 's' : '') + ' ' : '') +
    (s > 0 ? s + ' second' + (s > 1 ? 's' : '') + ' ' : '')
  );
};
