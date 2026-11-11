# System Design

"System design" covers the building blocks that large systems are made of, and how they are combined. Each folder here answers one question.

| Folder | Question it answers | Topics |
|---|---|---|
| `caching-and-load-balancing/` | How do I answer more requests faster? | caching, CDNs, load balancing (one overview page) |
| `reliability-patterns/` | How does a service keep working when its dependencies fail? | timeouts, retries, idempotency, circuit breakers, rate limits (one overview page) |
| `message-queues-and-logs/` | How do services pass messages reliably? | queues and logs, delivery guarantees, ordering (one overview page) |
| `databases/` | How is data stored, found and kept correct when the data or the traffic grows? | indexes, transactions and isolation levels, replication, sharding, CAP |

A folder is created when its first topic is added.

## Topic folder layout

```
system-design/<category>/<topic>/
  index.html   page: what it is, diagram with code, problems it solves, problems it introduces
```

## Topics

- [Databases Overview](databases/index.html) - databases: start here
- [Database Indexes](databases/indexes/index.html) - databases
- [Transactions and Isolation Levels](databases/transactions-and-isolation-levels/index.html) - databases
- [Database Replication](databases/replication/index.html) - databases
- [Sharding and Consistent Hashing](databases/sharding/index.html) - databases
- [CAP and Consistency](databases/cap-and-consistency/index.html) - databases
- [Caching, CDNs and Load Balancing](caching-and-load-balancing/index.html) - speed
- [Reliability Patterns](reliability-patterns/index.html) - reliability
- [Message Queues and Logs](message-queues-and-logs/index.html) - messaging
