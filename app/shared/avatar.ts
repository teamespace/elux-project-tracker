export function getAvatar(name: string): string {
  return `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(name)}`
}
