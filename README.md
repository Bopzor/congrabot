# CONGRABOT

`congrabot` will watch for messages comming from specified slackbots listed in `bots.json` file.  
If it's a notification for a push action, it will reply, mentionning the corresponding user, with a random phrase from `phrases.json`.

## Environment variables

> check `env.template` as example.

### Required

`SLACK_BOT_TOKEN`: Bot User OAuth Access Token from slack  
`SLACK_SIGNING_SECRET`: Signing Secret from slack

### Congrats feature

`CONGRATS`: boolean. Set to true will enable the feature

### Remind me daily feature

`REMIND_ME_DAILY`: boolean. Set to true will enable the feature  
`DAILY_TIME`: time at which you want to be reminded. `HH:MM:SS` format. Use `utc` / server timezone  
`DAILY_CHANNEL`: slack channel id to post reminder  
`COMBOS`: boolean. Set to true will enable combos use. Be aware that if you enable this, you will need to provide a `data/combos.json` file which contains all awailable combos in the folowing format:

```json
[
  ['<slack_userId_1>', '<slack_userId_2>'],
  ['<slack_userId_2>', '<slack_userId_1>'],
  ...
]
```

`CONGRATS`: boolean. Set to true will enable the feature

## Needed files

Create a `data` folder that will contains the folowing files:

### `bots.json`

A list of slackbots ids to watch,

```json
["B12345678"]
```

### `phrases.json`

A list of phrases that will be randomly sends,

```json
[
  "You rock! 🔥",
  "That's one small commit for the day, one giant push for the project 🚀",
  "You can be proud of your work! 😁",
  "You did it! 💪",
  "Goob job! 🎉",
  "Well done! ✋",
  "Noiiiiice 👌",
  "Nice work! 👍",
  "Bravo! 👏"
]
```

### `users.json`

An object that maps gitlab user full name and its corresponding slack user id.

```json
{
  "toto": "U0G9QF9C6"
}
```

---

## Make congrabot remind you of daily time and give you the order of passage of each team members

Set environement variable `REMIND_ME_DAILY` to `true` to enable the feature.

You will need those environement variable:

```sh
# enable the feature
REMIND_ME_DAILY=true

# the time at wich you want to me reminded ('HH:MM:SS' format)
DAILY_TIME=09:43:00

# slack channel to post the message
DAILY_CHANNEL=
```
