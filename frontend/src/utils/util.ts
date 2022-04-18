export function formatter(date: Date, format: string): string {
  const o = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };

  for (const k in o) {
    const exp: RegExp = new RegExp(`(${k})`, 'g');
    if (exp.test(format)) {
      const match: string = RegExp.$1;
      format = format.replace(
        match,
        match.length === 1
          ? '' + o[k]
          : ('00' + o[k]).substring(('' + o[k]).length + 2 - match.length)
      );
    }
  }

  return format;
}

export function ISOSformatter(ISOSdate: string) {
  const date: Date = new Date(ISOSdate);
  date.setHours(date.getHours() + 8);
  return date.toISOString().substring(0, 16).replace('T', ' ');
}
