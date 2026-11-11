# JavaScript

"JavaScript" covers the language's runtimes and the Node.js platform. Each folder here answers one question.

| Folder | Question it answers | Topics |
|---|---|---|
| `runtime/` | How does JavaScript run code? | event loop, promises and microtasks |
| `node/` | What is Node.js, and what does it add on top of the language? | how Node.js works, streams, worker threads, cluster |
| `web/` | How do I build an HTTP API on Node.js? | Express, Fastify, NestJS |
| `modules/` | How does one file use code from another? | CommonJS and ES modules |

A folder is created when its first topic is added.

## Topic folder layout

```
javascript/<category>/<topic>/
  index.html   page: what it is, diagram with code, problems it solves, problems it introduces
```

## Topics

- [Event Loop](runtime/event-loop/index.html) - runtime
- [Node.js](node/how-nodejs-works/index.html) - node
- [Node Streams](node/streams/index.html) - node
- [Express](web/express/index.html) - web
- [Fastify](web/fastify/index.html) - web
- [NestJS Modules and Providers](web/nestjs-modules-and-providers/index.html) - web
- [NestJS Request Lifecycle](web/nestjs-request-lifecycle/index.html) - web
- [CommonJS and ES Modules](modules/commonjs-and-es-modules/index.html) - modules
