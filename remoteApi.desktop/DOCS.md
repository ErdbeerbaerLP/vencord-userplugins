# API Documentation
This is the documentation for the RemoteAPI.

Default IP and Port configurations are assumed in the samples

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

## GET `/gameActivity`
Get the current status of the Game Activity toggle ("Share your detected activities with others")

Sample command:
```bash
$ curl http://127.0.0.1:1249/gameActivity
```

Sample output:
```json
{"value":true}
```

## GET `/gameActivity/toggle`
Toggles the Game Activity toggle ("Share your detected activities with others"). Returns the new value.

Sample command:
```bash
$ curl http://127.0.0.1:1249/gameActivity/toggle
```

Sample output:
```json
{"value":true}
```

## GET `/gameActivity/true`
Enables the Game Activity toggle ("Share your detected activities with others"). Returns the new value.

Sample command:
```bash
$ curl http://127.0.0.1:1249/gameActivity/true
```

Sample output:
```json
{"value":true}
```
## GET `/gameActivity/false`
Disables the Game Activity toggle ("Share your detected activities with others"). Returns the new value.

Sample command:
```bash
$ curl http://127.0.0.1:1249/gameActivity/false
```

Sample output:
```json
{"value":false}
```

## GET `/streamerMode/true`
Enables the Streamer Mode. Returns the new value.

Sample command:
```bash
$ curl http://127.0.0.1:1249/streamerMode/true
```

Sample output:
```json
{"value":true}
```
## GET `/gameActivity/false`
Disables the Streamer Mode. Returns the new value.

Sample command:
```bash
$ curl http://127.0.0.1:1249/streamerMode/false
```

Sample output:
```json
{"value":false}
```

## GET `/vc`
Gets the current voice-channel ID

Sample command:
```bash
$ curl http://127.0.0.1:1249/vc
```

Sample outputs:
```json
{"channelId":"1270800099064152096"}
```
```json
{"channelId":null}
```


## GET `/vc/mute/toggle`
Toggles your mute status

Sample command:
```bash
$ curl http://127.0.0.1:1249/vc/mute/toggle
```

Sample output:
```json
{}
```

## GET `/vc/deaf/toggle`
Toggles your deafen status

Sample command:
```bash
$ curl http://127.0.0.1:1249/vc/deaf/toggle
```

Sample output:
```json
{}
```


## POST `/vc/join`
Joins a voice channel

Parameters:
- `channel` - Channel ID of the target voice

Sample command:
```bash
$ curl -XPOST -H "Content-type: application/json" 'http://127.0.0.1:1249/vc/join' -d '{"channel": "1270800099064152096"}'
```

Sample outputs:
```json
{"success":true}
```
```json
{"success":false,"reason":"Missing permission"}
```

## POST `/vc/call`
Starts an voice call

Parameters:
- `channel` - **Channel** ID of the target DM. *NOT the User ID*

Sample command:
```bash
$ curl -XPOST -H "Content-type: application/json" 'http://127.0.0.1:1249/vc/call' -d '{"channel": "1270800099064152096"}'
```

Sample outputs:
```json
{"success":true}
```


## POST `/vc/setvolume`
Sets the volume of an individual user

Parameters:
- `user` - User ID of the user to set volume of
- `volume` - Target volume

Sample command:
```bash
$ curl -XPOST -H "Content-type: application/json" 'http://127.0.0.1:1249/vc/setvolume' -d "{\"user\": \"1013551644052574329\", \"volume\": 70}"
```

Sample output:
```json
{"success":true}
```



## POST `/vc/playsound`
Plays an soundboard sound in the current voice channel

Parameters:<br>
*right click a soundboard sound to copy JSON*

Sample command:
```bash
$ curl -XPOST -H "Content-type: application/json" 'http://127.0.0.1:1249/vc/playsound' -d '{"emoji_id":null,"emoji_name":null,"sound_id":"1109538939653603409","source_guild_id":"728633438441046016","volume":0.40441176295280457,"available":true}'
```

Sample output:
```json
{"success":true}
```

## POST `/message`
Sends an text message to a channel

Parameters:<br>
- `channel` - Target channel's ID
- `msg` - Message to send

Sample command:
```bash
$ curl -XPOST -H "Content-type: application/json" 'http://127.0.0.1:1249/message' -d '{"channel": "1271071419513442427", "msg": "=forceskip"}'
```

Sample output:
```json
{"success":true}
```
