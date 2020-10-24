# CONGRABOT

`congrabot` will watch for messages comming from specified slackbots listed in `bots.json` file.  
If it's a notification for a push action, it will reply, mentionning the corresponding user, with a random phrase from `phrases.json`.

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
