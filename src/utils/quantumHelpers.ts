// lib/quantumHelper.ts
interface Complex {
  real: number;
  imag: number;
}

export function getBlochVector(statevector: Complex[]): { x: number; y: number; z: number } | null {
  if (statevector.length !== 2) return null;

  const [a, b] = statevector;
  const ar = a.real, ai = a.imag;
  const br = b.real, bi = b.imag;

  const x = 2 * (ar * br + ai * bi);
  const y = 2 * (ai * br - ar * bi);
  const z = ar ** 2 + ai ** 2 - (br ** 2 + bi ** 2);

  return { x, y, z };
}
