if (process.env.NODE_ENV === 'production') {
  module.exports = {
   privateKey: process.env.VAPID_PRIVATE_KEY,
   publicKey: process.env.VAPID_PUBLIC_KEY

  }
} else {
  module.exports = {
    privateKey:
      'HmRMwYhniW5G5TPDObebOpQkv1UyNEIv1MNLCBF0tKI' ||
      process.env.VAPID_PRIVATE_KEY,
    publicKey:
      'BDX-BCj5PFLEqjxJgfQUAw3ONmp2hhwpTOU80Zh7pgfg7djdzeOFwWEfPjaF3Iy9xShB2b_TwjGf5ECMKlnMZ14' ||
      process.env.VAPID_PUBLIC_KEY,
  };
}
