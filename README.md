# VIP

A Next.js classroom game for reading code: practice questions, and a team sprint (planning, standup, work, review, retro) played in a shared room. tRPC, Drizzle and Neon Postgres.

## System design

How a request or a run moves through the code, then the choices behind that shape. In the decision charts, a **solid** box is the route this repo takes and a **dashed** box is the alternative it turns down; the edge label is the tradeoff.

### Request path

A Next.js app with tRPC. A `vip_session` cookie resolves to a player in the tRPC context, and every room mutation runs inside one Postgres transaction that locks the room row, applies a pure transition from `src/lib/sprint/state.ts`, and saves the new state. Clients poll `room.get` every 2 seconds.

```mermaid
sequenceDiagram
  participant C as Browser build page
  participant T as tRPC route
  participant X as createTRPCContext
  participant R as room router mutate
  participant S as sprint state pure functions
  participant D as Neon Postgres
  C->>T: room mutation with vip_session cookie
  T->>X: look up session and player
  X->>D: sessions join players
  T->>R: authed or teacher procedure
  R->>D: SELECT room FOR UPDATE
  R->>S: apply transition
  S-->>R: new SprintState or SprintError
  R->>D: UPDATE rooms SET state
  R-->>C: result
  loop every 2 s
    C->>T: room.get
  end
```

### Why this shape

Game rules are pure functions, so `scripts/check-sprint-logic.ts` can test them without a database, and a SprintError becomes a BAD_REQUEST. The row lock serialises two teams acting on one room. Polling a small JSON state every 2 seconds keeps the deploy a plain serverless app.

```mermaid
flowchart TD
  classDef chosen fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
  classDef rejected fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px,stroke-dasharray:5 5,color:#616161
  conc{"Two players act on one room"}
  conc -->|"load, check, transition, save under one lock"| lock["SELECT FOR UPDATE in a transaction"]
  conc -->|"last write wins"| race["Read then write, no lock"]
  rules{"Where the sprint rules live"}
  rules -->|"testable with no database"| pure["Pure state transitions in lib/sprint"]
  rules -->|"rules tangled with SQL"| inline["Logic inside the handlers"]
  sync{"How clients see new state"}
  sync -->|"no socket server, fits serverless"| poll["refetchInterval 2000"]
  sync -->|"needs a long-lived connection"| ws["WebSockets"]
  class lock,pure,poll chosen
  class race,inline,ws rejected
```
