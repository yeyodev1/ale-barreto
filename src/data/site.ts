// Datos de contacto del estudio. TODO: confirmar con el cliente antes de publicar.
export const site = {
  name: 'Ale Barreto Studio',
  short: 'AB',
  city: 'Ecuador',
  whatsapp: '593900000000', // TODO: número real, formato internacional sin "+"
  email: 'hola@alebarretostudio.com', // TODO: correo real
  instagram: 'https://www.instagram.com/', // TODO: perfil real
  instagramHandle: '@alebarretostudio', // TODO
}

export const waLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
