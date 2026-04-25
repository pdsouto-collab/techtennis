export const applyPhoneMask = (val: string) => {
  let v = val.replace(/\D/g, '');
  if (!v) return '';
  if (v.length > 2 && !v.startsWith('55')) v = '55' + v;
  else if (v.length <= 2 && v !== '5' && v !== '55') v = '55' + v;

  if (v.length <= 2) return `+${v}`;
  if (v.length <= 4) return `+55 (${v.slice(2)}`;
  if (v.length <= 9) return `+55 (${v.slice(2, 4)}) ${v.slice(4)}`;
  v = v.slice(0, 13);
  return `+55 (${v.slice(2, 4)}) ${v.slice(4, 9)}-${v.slice(9)}`;
};
