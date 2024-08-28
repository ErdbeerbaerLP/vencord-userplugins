# API Documentation
This is the documentation for the RemoteAPI.

## GET `/user`
Retrieve data from the logged in user.

Sample command:
```bash
$ curl http://127.0.0.1:1249/user
```

Sample output:
```json
{"id":"135802962013454336","username":"erdbeerbaerlp","discriminator":"0","avatar":"db591e630559e5770a95aedec4640232","avatarDecorationData":null,"banner":"814c6d2bc9995cc18cbf4547f24b95e9","email":"<hidden>","verified":true,"bot":false,"system":false,"mfaEnabled":true,"mobile":true,"desktop":true,"premiumType":2,"flags":4194400,"publicFlags":4194368,"purchasedFlags":7,"premiumUsageFlags":5,"phone":"<hidden>","nsfwAllowed":true,"guildMemberAvatars":{"728633438441046016":"<hidden>","733713795096248461":"<hidden>"},"hasBouncedEmail":false,"personalConnectionId":null,"globalName":"ErdbeerbaerLP","clan":null}
```

## GET `/`
