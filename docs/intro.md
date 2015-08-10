# What is PGP?

* PGP allows you to send encrypted messages. Encrypted messages can only be read by the recipient and no-one else.
* To send a message you need the recipient's **public key**. You will have to ask them to give you this.
* To receive messages you need a **private key**. [We can generate one for you](/#/generate).

# Is pgp.help secure?

This website is designed with security in mind. No data is sent over the internet. Key data is (optionally) retained within your browser but nowhere else. However you shouldn't just take my word for it, it is important to understand the risks and how they have been managed. Here are the main risks explained:

### Can pgp.help steal your data?

No!

pgp.help uses [Content Security Policy]("http://www.html5rocks.com/en/tutorials/security/content-security-policy/") headers to prohibit your browser from sending any data from this page over the internet. You can check these for yourself if you do right-click -> view source. Near the top you will see something like this:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self';">
```

The `default-src 'none'` means "don't load anything from anywhere", followed by some exceptions: `script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'` which allows this site to load up some scripts, styles, fonts, and images - but *only* from the place where this website was fetched from in the first place.

If this website attempts to load data from anywhere else, or make any data connections then your browser will prevent this. It might be possible to use [cunning tricks]("http://scarybeastsecurity.blogspot.co.uk/2009/12/generic-cross-browser-cross-domain.html") to leak data back to the pgp.help themselves. If you are concerned then I suggest you use a local copy of this website to prevent this. See below.

### Could pgp.help be hacked?

It's a possibility - to prevent this use a local copy.

Obviously we take steps to keep the website secure, but it's possible that someone could hack into the site and change the scripts to steal your data. If they did this they would also have to alter the CSP headers - see above.

The simplest way to prevent this risk is to save a known-good copy of the website. There is a link in the footer that allows you to download and save the website locally. You can verify the CSP header manually to check that it is safe before using it (see above).

### Could my browser be hacked?

It's unlikely - if you keep your browser up to date.

Modern browsers that are kept up to date are relatively secure. Serious zero day exploits do happen but they are rare and get fixed quickly. Still you can minimise any risks by doing
PGP work in a separate browser process to your regular browsing. If there is demand then I will package a standalone executable that will significantly minimise risks from browser exploits.

###Can I help with your project? Can you help with my project?

I'd love any help! Feel free to contact me, or just send me pull requests. Whatever makes you happy. I'm especially interested if you spot any secruity issues. I'm also looking for someone who can help me make my html / css look prettier. I am willing to pay for certain things (via Bitcoin), so please get in touch.

I'm currently looking for work in the security space. If you are interested or thing I could help please get in touch. If you would like specific enhancements added to the site then please feel free to ask.

# How can I contact you? What is your PGP key?

You can email me at hello@pgp.help

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v1.2.0
Comment: https://pgp.help

xsBNBFW7TH8BCADccz73OFQprAsBLNTFNZFTPzDUbmwKn5BMFFK7rYf7v8Gj
PyYQrl9DupBTiP6ISyTIvn/pT0/+G1yTYzliej4UZP7LOUz+pg59/X2JP7Ko
3UzH9qoO3FYXl85ok/daSNRt0VrKSoGcMuoLw7CT48hHZdIXSwoPFP//n8Qo
3u1J3LghZQLPdnZfWHPA6ZKLvcgQaByCABsRrH7L75+Qw49Wb3VeBiE5u26E
j3NXUc1GskMvFHp8pUnfzFxF4sCzk/o+zqJW8NtIje48beufH4eMBF2NK6nF
1Et8ESCM7jE10rpWm+nsl8lMooQEbUXoMp2z2s2zuYmaiV+ONaa3UT6fABEB
AAHNGVBncCBIZWxwIDxoZWxsb0BwZ3AuaGVscD7CwHIEEAEIACYFAlW7TIAG
CwkIBwMCCRAj/Z8+mwZ1aQQVCAIKAxYCAQIbAwIeAQAApGkIAJCtB3PD5aka
rGPzePxmqc37cpOGx/ArO8M7ouXDkc75xt3MOMvAFB4y8lytwteXbLG50Kl0
1KHp1NkUEJM0eR8SxGaPipEgN0PRoEDhN8VgR3m4Lq5RlTMFq1yXQgjPGndB
sP+KIDSfBEPZOlMW9VgdzThjqj8WqVxvaoRPbazLpS+WYrGTx4WjcsoS53ou
b7Fd6rkOdZcbgmUooDHRiNSNJq+RCwZnffxLlJQp3r3U0Ll4Mrsb/pxcOjde
7Cnc1SildK3m5iIuteGSIl8qXXTidcw5vV9w1xDLu7mPztaXlM72KaVkuhJN
/mSaCFTAAgECmvgP88ByG0uDu4SpeFrOwE0EVbtMfwEIAM/+tJfjT8ER4qe0
VJJPCqAcUffyXyABnN4NymDxz97ol9xwi2boTb2oDtTkAXmTU5pKKOjZFtV1
FizpVemVoGWBnmEZBaOUMZy2qFEIHrPh0OWaiuCSr+m/VjvOWota//bJZg1H
/o9JaMXSefE+lWak/BZagMAX/EOWUfzYfNSfHViua5HxKA5PoQ7Blcxt7T1f
5427XhoSpZzdbi9XjlYZmFlQ08MYG18wTVa6g8MJ7qr9TIVZPRnSrtE15iP1
8py3tXn97PToLd78ZkTfnlKZwrMxuFHcNCHMpVbEXD6zVWATeMMNRo5an3kg
dE9+9odr2zZWdJgnN1PDwbGKeEEAEQEAAcLAXwQYAQgAEwUCVbtMgQkQI/2f
PpsGdWkCGwwAAL2qCACSkHd3SDv1XTJJcwsazkXr+NMJaNSN7qQFPMboDS0Z
3pX27Rn1ev1UHTqFKBYgogxyeUOnbeXE+VAFYuoeNCbFYY1TFhvGVWRax/rf
PBuVQ4d1+g87nxSL3JFwvSGzTjPkJiU+rGOIkOqYK0JA/T8+ZqrXTQoH2d7i
r1vldA2CakQ+Mf+BjHjG06doQlrbuGBYXLWJbATpcKmK++kWaGE01h5rFbx8
JmS3SZME1N2bdm99TJVzbWbHqcJge/1lfEY1PecjweX2McXQEVGmZLPdN6dF
HLrZ5SS/qnXSXE79odO4Cd/gx1nJrovmut1vZfxh3yyLOnh9+BZX/NeU9FWu

=MMEa
-----END PGP PUBLIC KEY BLOCK-----

```
