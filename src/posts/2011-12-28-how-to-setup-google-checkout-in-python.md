---
layout: post 
title: How to setup Google Checkout in Python
categories: python google
summary: Setting up the Google Checkout API in Python
---
The Google Checkout API is a dream to use because its low-level calls means that it's freely customizeable on any web framework. However, as is customary with Google technology, the documentation is sparse as to particular implementation. Here's how to sign and submit a cart request in Python 2.5 (should work on all pre 3 Python versions)

1. Generate a form to embed in your cart.
2. Base64 encode the form
3. Sign the encoded form
4. Send the signed form

```html
<form method="POST" action="https://sandbox.google.com/checkout/api/checkout/v2/checkout/Merchant/{{=merchant_id}}">
    <input type="hidden" name="cart" value="{{=base_64_request}}">
    <input type="hidden" name="signature" value="{{=base_64_hmac_encoded_request}}">
    <input type="image" name="Google Checkout" alt="Fast checkout through Google" src="{{=IMAGE_URL}}">
</form>
<!--  Cart: base64-encoded Checkout API XML request - base_64_request -->
<!--  Signature: base64-encoded HMAC-SHA-1 signature - base_64_hmac_encoded_request -->
<!-- Merchant ID: the merchant ID supplied by Google on sign-up - merchant_id ->
```

- HMAC-SHA-1 THEN Base-64 encode the XML cart: `base_64_hmac_encoded_request`

```python
  import base64
  import hashlib
  import hmac


def hmac_sha1(input_string,key):

  hashed = hmac.new(key, input_string, hashlib.sha1).digest()
  return hashed
    
def base_64_encode(input_string):

  return base64.b64encode(input_string)

def base_64_hmac_encoded_request
```
