import slugify from 'slugify'

export const fetchDefaultImage = (type: string) => {
  if (type === 'GOOGLE') return 'user/default-google.png'
  if (type === 'GITHUB') return 'user/default-github.png'
  return 'user/default-user.png'
}

export const convertSlugUrl = (string: string) => {
  if (!string) return ''

  const slug = slugify(string, {
    lower: true,
    locale: 'vi'
  })

  return slug
}