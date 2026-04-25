export const applyPhoneMask = (val: string) => {
  if (!val) return '';
  const hasPlus = val.includes('+');
  let v = val.replace(/\D/g, '');
  
  if (!v) return hasPlus ? '+' : '';

  // Se tem '+' e não começa com '55', o usuário está forçando outro país
  // Se não tem '+', assumimos o padrão '55' (Brasil) mesmo que ele não digite o 55.
  if (!v.startsWith('55') && !hasPlus) {
    v = '55' + v;
  }

  // Máscara para o Brasil +55
  if (v.startsWith('55')) {
    if (v.length <= 2) return `+${v}`;
    if (v.length <= 4) return `+55 (${v.slice(2)}`;
    if (v.length <= 9) return `+55 (${v.slice(2, 4)}) ${v.slice(4)}`;
    v = v.slice(0, 13); // limita a +55 (11) 99999-8888
    return `+55 (${v.slice(2, 4)}) ${v.slice(4, 9)}-${v.slice(9)}`;
  } 
  
  // Máscara para EUA/Canadá +1
  if (v.startsWith('1')) {
    if (v.length <= 1) return `+${v}`;
    if (v.length <= 4) return `+1 (${v.slice(1)}`;
    if (v.length <= 7) return `+1 (${v.slice(1, 4)}) ${v.slice(4)}`;
    v = v.slice(0, 11);
    return `+1 (${v.slice(1, 4)}) ${v.slice(4, 7)}-${v.slice(7)}`;
  }

  // Falha de formato puro internacional para o resto do mundo
  // Retorna sem máscara, liberando a digitação completa
  v = v.slice(0, 15); // Limite máximo internacional (ITU-T E.164)
  return `+${v}`;
};

export const applyCpfCnpjMask = (val: string) => {
  if (!val) return '';
  let v = val.replace(/\D/g, '');
  if (v.length <= 11) {
    v = v.slice(0,11);
    if (v.length > 9) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
    if (v.length > 6) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
    if (v.length > 3) return `${v.slice(0,3)}.${v.slice(3)}`;
    return v;
  }
  v = v.slice(0,14);
  if (v.length > 12) return `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8,12)}-${v.slice(12)}`;
  if (v.length > 8) return `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8)}`;
  if (v.length > 5) return `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5)}`;
  if (v.length > 2) return `${v.slice(0,2)}.${v.slice(2)}`;
  return v;
};
