# Architecture

"Architecture" covers several separate questions. Each folder here answers one of them.

| Folder | Question it answers | Topics |
|---|---|---|
| `code-organization/` | How is the code arranged inside one application? | layered, hexagonal, clean, onion, vertical slice, MVC |
| `system-topology/` | How is the system split into parts you deploy and run? | monolith, modular monolith, microservices, serverless |
| `api-and-integration/` | How do clients and services talk to each other? | backend for frontend, API gateway, REST vs gRPC vs GraphQL |
| `messaging-and-events/` | How do parts react to things that happened elsewhere? | event-driven, pub/sub, saga, outbox |
| `data-and-state/` | How is data stored, read and changed? | CQRS, event sourcing, database per service |
| `domain-modeling/` | How is the business modelled in code? | domain-driven design, bounded contexts, aggregates |

A folder is created when its first topic is added.

## Topic folder layout

```
architecture/<category>/<topic>/
  index.html   page: what it is, diagram with code, problems it solves, problems it introduces
```

## Topics

- [Hexagonal Architecture](code-organization/hexagonal/index.html) - code organization
- [Monolith](system-topology/monolith/index.html) - system topology
- [Modular Monolith](system-topology/modular-monolith/index.html) - system topology
- [Microservices](system-topology/microservices/index.html) - system topology
- [Backend for Frontend](api-and-integration/backend-for-frontend/index.html) - API and integration
- [Domain-Driven Design](domain-modeling/domain-driven-design/index.html) - domain modeling
- [Event-Driven Architecture](messaging-and-events/event-driven/index.html) - messaging and events
