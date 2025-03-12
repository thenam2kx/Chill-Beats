export const fetchDefaultImage = (type: string) => {
  if (type === 'GOOGLE') return 'user/default-google.png'
  if (type === 'GITHUB') return 'user/default-github.png'
  return 'user/default-user.png'
}