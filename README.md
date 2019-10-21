# Static accounts for AWS Console Switch Role

AWS Console only remembers the last 5 role-account combination for switching role. Switching role in the console is usually a cumbersome operation (you need to fill a form, and account numbers are difficult to remember)

This script lets you configure a set of role-account pairs and they will always appear just next to your switch role history. Additionally, it will let you choose arbitrary colors for those roles, and will change the AWS Console header color to match the current environment color.

<img width="1057" alt="Screenshot 2019-10-21 09 59 10 copy" src="https://user-images.githubusercontent.com/15752/67187264-1ca54200-f3ea-11e9-9253-71a81ac34743.png">


## Install

You need to have [Tampermonkey](https://www.tampermonkey.net) or [Violentmonkey](https://violentmonkey.github.io) extension installed and activated.

Install script by visiting [the raw version](https://github.com/gonzalosr/static-account-switch-aws/raw/master/static-account-switch-aws.user.js)

## Configure

Visit the AWS Console for the first time with the userscript activated. This will create a default configuration for you in the userscript manager preferences, so your configuration will persist across userscript updates.

Once you have done that, edit the script in your userscript extension management page, go to `Storage` tab and edit the config.

### Explained account config parameters

- `displayName`: How the name will be displayed in the menu
- `roleName`: the target role you are switching to
- `accountNumber`: The AWS account number of the account you are switching to
- `mfaNeeded`: `0` if not needed, `1` if it's required
- `navColor`: The color for the navigation bar when you change to this role
- `backgroundColor`: The background color for the menu icon (empty if you use an icon other than `&nbsp;`)
- `labelIcon`: The icon for the menu element (AWS default is `&nbsp;`)


### Example config (2 role-account pairs)

```
{
    "userConfig": [
        {
            "displayName": "development",
            "roleName": "myawsrole",
            "accountNumber": "00000000",
            "mfaNeeded": "0",
            "navColor": "14fc03",
            "backgroundColor": "",
            "labelIcon": "😁"
        },
        {
            "displayName": "staging",
            "roleName": "myawsrole",
            "accountNumber": "00000000",
            "mfaNeeded": "0",
            "navColor": "031cfc",
            "backgroundColor": "",
            "labelIcon": "🚀"
        }

    ]
}
```

Save config in the Storage tab for the userscript (edit script, then go to the storage tab). If the storage tab is not present, remember to generate the config by visiting the AWS console once with the userscript activated, then reload the script editing page.

<img width="1058" alt="Screenshot 2019-10-21 09 51 59" src="https://user-images.githubusercontent.com/15752/67186763-09de3d80-f3e9-11e9-9ac7-8f21bba5ee0f.png">


Enjoy!
