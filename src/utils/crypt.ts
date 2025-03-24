const PRIVATE_KEY =
  'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0dgj9afv1UTRGTgDIVy' +
  'dSgV04vfaIwcGpQ7jxvQXPdK2VjlbcRoIhza6cWjs/WbjlTISoI5Tl2vQdrEXdnMq4o3YK' +
  'QppJMWCtL8O8g5oi2FI5lPLVduQFoPR9Ist6eyTytQSfPm164JDPBZQVXSnwor0oKaGXUc' +
  'bvgYfhbOmzQjzdnamxRte/nBcbs+7qEKSw5NRlXT36PK9+O8bTaxd/Br3SXsMSmBH0i+Gg' +
  '0DjbXfshimZInFYiiYljp4nobYPo/cqxv6TpsktOYvuETlmVovuC83XBT3CrFWt+gazcDh' +
  'eGvQqevLqh6tIxm2zdPMmnjMQNw3Ybs+NYa9eY+E+1AgMBAAECggEAH0wRRxHodqU8say5' +
  'igVDdpWk+0BGz3T7B0YNfy9PIKmVqUhkXBOGYiJv1AH6IISJAouAvkBdhHeyuqqz+zlEFz' +
  '2SLTlb1LHRmHeeNMWGJ+DoccAZVVgnN6qwfDtamsVcpRMr2ApVpmfn9V98TTA5I9i1gY+m' +
  'zL2MCOGoFTp0VXguWuSa1nZTfoSg1uG2vk1+OrxWYxWR4BjX6fTg/qPZ2Hvvn6XHdooNwr' +
  '7m2CaDcX5oTgpSVfo/7HVebrOs+V1PKwuyVzpcQ9udNZabxPjsN2A8wwtq0RYW/9GL0DdN' +
  'BegLwp4mMMhaPhs0kuXRr6Xxa0u7pzCRb7K6XOK1uOFKiQKBgQDwmQgtQq//un2l3VjE2D' +
  'qY53kkuviMsrNLWYsxv5uDVvppRlsaQp0wUcsAGWGbS1Dt0z2TTDwRzN44Bn2kxfve7sHA' +
  '+KDA5T/Iqlfu3+zl6bRQwCUOqAibmFkMwagKoYB7p2+ao+Z2uGYRG1tuvTnwGGNiClxtUf' +
  'cfaqDrap4xewKBgQDAA3hNSge7Tmgyuto/06qb7k0TAaZNx2hqs71xugONNjKeEol3y2Vo' +
  '8BVlzqpPuNJQ0hepIXs1ALopxC7P+/e8e9v3o3uEmoufTvRFL2EFB8Wr5z61BJ/6SKT0QL' +
  'i4xRevLq07v/LkUBoomgwtB9RWchSj2cY/saI7RB92H4JEjwKBgCUBZKCRgUB0Dp9UTDL6' +
  'jwi1kYx0tYXudmVAgIhGUEUDO8C1cY24cTTdX7vEK58XFnt94hqlvxd9yzASz4BoczT2xB' +
  'ZKJ2+D0yuqB5xWFLnIGFPTOd/nOGu2IvwzTQVVkc1zE1dVnjzkX86Bxq5hrGehWKfbsBug' +
  'X8IVRGrxGyPBAoGAfa6HwwdO8kJLH9GAY8DXboNXvbYZtdVtOlJ2EQexpW+xSBhYFKp0sX' +
  'BcgSv5/H68YxxxUkpRDAtyzz3Tal3B9YSZIYnHoq9J7rfOWa6+cX153KBbQj9Ju5hrKFlo' +
  'z8BqVUdXKsHkaZ8o0CStDZiPWxoG+ozkH/LUfriDY10Sdm8CgYEAvY6tcfAKCWS+DDAvKa' +
  '99Gkdzzw8hOc1jrml/GNGlAlYJyB1ZOwHWySLpwMIIsYZ8mcG1cz4JWhbQEMAXQqMo1bL7' +
  'b9gBQIWIYgA64kIKyW8rUc15wWN/kTEgGJ9K6LrOgk4eWiom4iQWrP/9yrtdJVJcGtff2o' +
  'YCqdG2v1Isfu8='

const PUBLIC_KEY =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtHYI/Wn79VE0Rk4AyFcnUoFdOL' +
  '32iMHBqUO48b0Fz3StlY5W3EaCIc2unFo7P1m45UyEqCOU5dr0HaxF3ZzKuKN2CkKaSTFg' +
  'rS/DvIOaIthSOZTy1XbkBaD0fSLLensk8rUEnz5teuCQzwWUFV0p8KK9KCmhl1HG74GH4W' +
  'zps0I83Z2psUbXv5wXG7Pu6hCksOTUZV09+jyvfjvG02sXfwa90l7DEpgR9IvhoNA42137' +
  'IYpmSJxWIomJY6eJ6G2D6P3Ksb+k6bJLTmL7hE5ZlaL7gvN1wU9wqxVrfoGs3A4Xhr0Knr' +
  'y6oerSMZts3TzJp4zEDcN2G7PjWGvXmPhPtQIDAQAB'

const privateCryptoKey = await window.crypto.subtle.importKey(
  'pkcs8',
  Uint8Array.from(window.atob(PRIVATE_KEY), c => c.charCodeAt(0)),
  { name: 'RSA-OAEP', hash: 'SHA-256' },
  true,
  ['decrypt']
)

const publicCryptoKey = await window.crypto.subtle.importKey(
  'spki',
  Uint8Array.from(window.atob(PUBLIC_KEY), c => c.charCodeAt(0)),
  { name: 'RSA-OAEP', hash: 'SHA-256' },
  true,
  ['encrypt']
)

export const decrypt = async (data: string, privateKey: CryptoKey = privateCryptoKey) => {
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    Uint8Array.from(window.atob(data), c => c.charCodeAt(0))
  )
  return new TextDecoder().decode(decrypted)
}

export const encrypt = async (data: string, publicKey: CryptoKey = publicCryptoKey) => {
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    new TextEncoder().encode(data)
  )
  return window.btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}
