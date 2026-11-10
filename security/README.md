# Security

"Security" covers several separate questions. Each folder here answers one of them.

| Folder | Question it answers | Topics |
|---|---|---|
| `authentication/` | How does a server know who is calling? | sessions and tokens, JWT, access and refresh tokens, OAuth 2.0 and OpenID Connect |
| `authorization/` | What is this caller allowed to do? | roles, permissions, scopes, policies |
| `web-security/` | How are web apps attacked, and how are they protected? | XSS, CSRF, CORS, SQL injection |

A folder is created when its first topic is added.

## Topic folder layout

```
security/<category>/<topic>/
  index.html   page: what it is, diagram with code, problems it solves, problems it introduces
```

## Topics

- [Sessions and Tokens](authentication/sessions-and-tokens/index.html) - authentication
- [JWT](authentication/jwt/index.html) - authentication
- [Access and Refresh Tokens](authentication/access-and-refresh-tokens/index.html) - authentication
