# Tauticord Web Config

Simple web page to edit your Tauticord configuration files through a browser instead of manually editing text files.

## What this does

This is just a basic web form that helps you create Tauticord configuration files. Instead of manually writing the config file or trying to remember all the settings, you just fill out a form and it generates the config for you.

## How to use it

1. Open index.html in your browser
2. Fill out the form with your Discord bot token, Tautulli settings, etc.
3. Click generate or whatever the button says
4. Copy the config it creates and paste it into your Tauticord config file

## Requirements

- Any web browser
- That's pretty much it

## File structure

```
tauticord-web-config/
├── index.html          # Main page
├── styles.css          # Basic styling
├── script.js           # Form handling
└── README.md           # This file
```

## Setup

1. Download the files
2. Open index.html in your browser
3. Fill out the form with your settings
4. Copy the generated config when you're done

## Important notes

- Back up your config files before using this
- This assumes you know where your Tauticord files are located
- You might need to adjust file permissions depending on your setup
- This is pretty basic, don't expect fancy features

## Troubleshooting

If it's not working:
- Make sure JavaScript is enabled in your browser
- Try refreshing the page
- Check the browser console for errors

## Security warning

This is just a local HTML form. Your settings don't get sent anywhere, it just generates the config text for you to copy.

## What Tauticord is

Tauticord is a Discord bot that shows your Plex server activity in Discord. If you don't know what that is, this tool probably isn't for you.

You can find the original Tauticord project here: https://github.com/nwithan8/tauticord

## Contributing

Feel free to submit issues or pull requests if you find bugs or want to add features. This is pretty basic so there's probably room for improvement.

## License

Do whatever you want with this code. It's not complicated enough to worry about licensing.
