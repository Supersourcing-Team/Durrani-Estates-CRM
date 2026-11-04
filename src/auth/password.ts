/** Module 1 client-side password rule. */
export function passwordOk(pw: string): boolean {
  return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
}

export function passwordHint(pw: string): string | null {
  if (!passwordOk(pw)) return "Use at least 8 characters with a letter and a number.";
  return null;
}
