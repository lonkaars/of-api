# of-api

This is an unofficial Optifine download API. It just scrapes the Optifine
website and creates JSON files with download links and metadata about each
Optifine version. This doesn't technically go against Optifine's copyright
policy because you're still downloading from their servers. The only thing this
does is make it easier to programmatically download optifine.

This 'API' is designed to generate files periodically and then host them using
a static serving web server like nginx or apache. A live version can be found
on <https://of.pipeframe.xyz>, all endpoints will then be used with this base
URL. Please open an issue if you have any questions regarding the API, or if
any links are broken since I'm currently too lazy to setup a systemd timer that
runs it automatically.

## Endpoints:

All response types are documented in [types.ts](./types.ts)

### `/all`

```
{ APIResponse }
```

### `/latest`

```
{ OptifineVersion }
```

### `/latestPre`

```
{ OptifineVersion }
```

### `/[mc version]`

`[mc version]` can be any valid Minecraft version string, eg. `1.7.10` or `1.8.9`.

```
[ OptifineVersion ]
```

