export const PROJECT = {
  whatsappNumber: '573000000000',
  whatsappBase: 'https://wa.me/573000000000',
} as const;

export function whatsappUrl(mensaje: string): string {
  return `${PROJECT.whatsappBase}?text=${encodeURIComponent(mensaje)}`;
}
