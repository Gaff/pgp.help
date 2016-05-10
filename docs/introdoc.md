# What is PGP?

PGP uses [public key cryptography](https://simple.wikipedia.org/wiki/Public-key_cryptography) to allows you to send and receive encrypted messages.

You may have been sent here by someone who wants you to send them an encrypted message. This is what you need to do:

* Paste their public key into the public key box.
* Type your message to them in the message box.
* Copy the encrypted message from the result box and send it back to them.

To receive messages you need a **private key**. [We can generate one for you](https://pgp.help/#/generate).

# How secure is pgp.help?

This website is designed with security in mind. No data is sent over the internet. Key data is (optionally) retained within your browser but nowhere else. However you shouldn't just take my word for it, it is important to understand the risks and how they have been managed. Here are the main risks explained:

### Can pgp.help steal your data?

No!

pgp.help uses [Content Security Policy](http://www.html5rocks.com/en/tutorials/security/content-security-policy/) headers to prohibit your browser from sending any data from this page over the internet. You can check these for yourself if you do right-click -> view source. Near the top you will see something like this:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self';">
```

The `default-src 'none'` means "don't load anything from anywhere", followed by some exceptions: `script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'` which allows this site to load up some scripts, styles, fonts, and images - but *only* from the place where this website was fetched from in the first place.

If this website attempts to load data from anywhere else, or make any data connections then your browser will prevent this. It would be theoretically possible to use [tricks](http://scarybeastsecurity.blogspot.co.uk/2009/12/generic-cross-browser-cross-domain.html) to leak data back to the pgp.help itself - but since this is hosted by github pages, which only alows for static content, it wouldn't be possible to record the data. You can monitor the connections made by pgp.help to ensure that it isn't attempting to steal data this way. If you are concerned then I suggest you use a local copy of this website to prevent this. See below.

### Could pgp.help be hacked?

It's a possibility - to prevent this use a local copy.

Obviously we take steps to keep the website secure, but it's possible that someone could hack into the site and change the scripts to steal your data. If they did this they would also have to alter the CSP headers - see above.

The simplest way to prevent this risk is to save a known-good copy of the website. There is a link in the footer that allows you to download and save the website locally. You can verify the CSP header manually to check that it is safe before using it (see above).

### Could my browser be hacked?

It's unlikely - if you keep your browser up to date.

Modern browsers that are kept up to date are relatively secure. Serious zero day exploits do happen but they are rare and get fixed quickly. Still you can minimise any risks by doing
PGP work in a separate browser process to your regular browsing. If there is demand then I will package a standalone executable that will significantly minimise risks from browser exploits.

### Is it safe to store key data?

Generally yes, unless you load this website from a local file.

Html5 local storage is visible only to pages loaded from the same origin. This means you must trust that all pages on that domain won't steal data. 

If you load from a local file, the origin is file://, which means any other html pages loaded from a file can see your key data. This is not a great idea and this webpage will warn you against using storage in this configuration. I have some thoughts on how this could be improved. Please contact me if this would be useful to you.

# About pgp.help

### What technology does pgp.help use?

pgp.help is primarily built upon:

* [Angular.js](https://angularjs.org/)
* [Bootstrap](http://getbootstrap.com/)
* [Openpgpjs.org](http://openpgpjs.org)
* [Github pages](https://pages.github.com/)
* [Cloudflare](https://www.cloudflare.com/)

### What about licensing?

Most components are MIT licensed. Openpgpjs is LGPL. Please refer to the github repo and individual components for full details.

### Can I help with your project? Can you help with my project?

I would love any help! Feel free to contact me, or just send me pull requests. Whatever makes you happy. I am especially interested if you spot any security issues. I am also looking for someone who can help me make my html / css look prettier. I am willing to pay for certain things (via Bitcoin), so please get in touch.

I am currently looking for work in the security space. If you are interested or think I could help please get in touch. If you would like specific enhancements added to the site then please feel free to ask.

### How can I contact you? What is your PGP key?

You can email me at hello@pgp.help

[Here is a link to my key](https://pgp.help/#/permalink?pgp=-----BEGIN%20PGP%20PUBLIC%20KEY%20BLOCK-----%0D%0AVersion:%20OpenPGP.js%20v1.2.0%0D%0AComment:%20https:%252F%252Fpgp.help%0D%0A%0D%0AxsBNBFW7TH8BCADccz73OFQprAsBLNTFNZFTPzDUbmwKn5BMFFK7rYf7v8Gj%0APyYQrl9DupBTiP6ISyTIvn%252FpT0%252F%2BG1yTYzliej4UZP7LOUz%2Bpg59%252FX2JP7Ko%0A3UzH9qoO3FYXl85ok%252FdaSNRt0VrKSoGcMuoLw7CT48hHZdIXSwoPFP%252F%252Fn8Qo%0A3u1J3LghZQLPdnZfWHPA6ZKLvcgQaByCABsRrH7L75%2BQw49Wb3VeBiE5u26E%0Aj3NXUc1GskMvFHp8pUnfzFxF4sCzk%252Fo%2BzqJW8NtIje48beufH4eMBF2NK6nF%0A1Et8ESCM7jE10rpWm%2Bnsl8lMooQEbUXoMp2z2s2zuYmaiV%2BONaa3UT6fABEB%0AAAHNGVBncCBIZWxwIDxoZWxsb0BwZ3AuaGVscD7CwHIEEAEIACYFAlW7TIAG%0ACwkIBwMCCRAj%252FZ8%2BmwZ1aQQVCAIKAxYCAQIbAwIeAQAApGkIAJCtB3PD5aka%0ArGPzePxmqc37cpOGx%252FArO8M7ouXDkc75xt3MOMvAFB4y8lytwteXbLG50Kl0%0A1KHp1NkUEJM0eR8SxGaPipEgN0PRoEDhN8VgR3m4Lq5RlTMFq1yXQgjPGndB%0AsP%2BKIDSfBEPZOlMW9VgdzThjqj8WqVxvaoRPbazLpS%2BWYrGTx4WjcsoS53ou%0Ab7Fd6rkOdZcbgmUooDHRiNSNJq%2BRCwZnffxLlJQp3r3U0Ll4Mrsb%252FpxcOjde%0A7Cnc1SildK3m5iIuteGSIl8qXXTidcw5vV9w1xDLu7mPztaXlM72KaVkuhJN%0A%252FmSaCFTAAgECmvgP88ByG0uDu4SpeFrOwE0EVbtMfwEIAM%252F%2BtJfjT8ER4qe0%0AVJJPCqAcUffyXyABnN4NymDxz97ol9xwi2boTb2oDtTkAXmTU5pKKOjZFtV1%0AFizpVemVoGWBnmEZBaOUMZy2qFEIHrPh0OWaiuCSr%2Bm%252FVjvOWota%252F%252FbJZg1H%0A%252Fo9JaMXSefE%2BlWak%252FBZagMAX%252FEOWUfzYfNSfHViua5HxKA5PoQ7Blcxt7T1f%0A5427XhoSpZzdbi9XjlYZmFlQ08MYG18wTVa6g8MJ7qr9TIVZPRnSrtE15iP1%0A8py3tXn97PToLd78ZkTfnlKZwrMxuFHcNCHMpVbEXD6zVWATeMMNRo5an3kg%0AdE9%2B9odr2zZWdJgnN1PDwbGKeEEAEQEAAcLAXwQYAQgAEwUCVbtMgQkQI%252F2f%0APpsGdWkCGwwAAL2qCACSkHd3SDv1XTJJcwsazkXr%2BNMJaNSN7qQFPMboDS0Z%0A3pX27Rn1ev1UHTqFKBYgogxyeUOnbeXE%2BVAFYuoeNCbFYY1TFhvGVWRax%252Frf%0APBuVQ4d1%2Bg87nxSL3JFwvSGzTjPkJiU%2BrGOIkOqYK0JA%252FT8%2BZqrXTQoH2d7i%0Ar1vldA2CakQ%2BMf%2BBjHjG06doQlrbuGBYXLWJbATpcKmK%2B%2BkWaGE01h5rFbx8%0AJmS3SZME1N2bdm99TJVzbWbHqcJge%252F1lfEY1PecjweX2McXQEVGmZLPdN6dF%0AHLrZ5SS%252FqnXSXE79odO4Cd%252Fgx1nJrovmut1vZfxh3yyLOnh9%2BBZX%252FNeU9FWu%0A%0D%0A%3DMMEa%0D%0A-----END%20PGP%20PUBLIC%20KEY%20BLOCK-----%0D%0A%0D%0A)

And here it is in verbatim:

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
