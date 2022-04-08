export function formatter(date: Date, format: string): string {
  const o = {
    'y+': date.getFullYear(),
    'M+': date.getMonth(),
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
