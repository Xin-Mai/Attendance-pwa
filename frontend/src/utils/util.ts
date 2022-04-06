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
    console.log('test');
    if (new RegExp(k).test(format)) {
      format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? '' + o[k]
          : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }

  return format;
}
