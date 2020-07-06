Hash:
```javascript
    console.log(crypto.createHash('sha256').update(CREATE_ACCOUNT_CADENCE, 'utf8').digest('hex'))
```