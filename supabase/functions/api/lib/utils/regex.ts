export function validateEmail(email: string): boolean {
  return /^[a-z0-9]{3,29}@newzet\.me$/.test(email);
}
