# The Sovereign Paranoia Architecture (Seven-Layer Systems Doctrine)

This document serves as the mandatory engineering protocol for all core logic, AI pipelines, and distributed infrastructure within this codebase. A three-layer model protects against basic crashes and clumsy users, but still collapses under race conditions, poison payloads, retry storms, and silent data corruption.

Every feature, refactor, or bug fix **must pass sequentially through all seven layers** before deployment. Notice how even standard defensive fixes in Layers 1 and 2 contain fatal hidden flaws when examined through higher layers.

---

### Layer 0: The Deterministic Core
**Objective:** Solve the fundamental problem with pure, predictable mechanics.
**Core Prompt:** *"Does this logic execute the exact business requirement with zero ambiguity?"*

Build the foundational state machine assuming infinite memory, zero network latency, and well-formed inputs. Keep business logic isolated from infrastructure side effects so it can be tested deterministically.

*   **Worker Queue:** Poll pending jobs and execute the handler function using strictly typed input and output schemas.
*   **LLM API Client:** Construct the prompt payload, pass the API key to the client, and return the parsed response.
*   **Strict Contracts:** Define explicit pre-conditions and post-conditions before writing a single line of error handling.

---

### Layer 1: Physics & Infrastructure Paranoia
**Objective:** Immunize the logic against a hostile, decaying hardware and network environment.
**Core Prompt:** *"What happens when the process dies mid-instruction, the network partitions, or the clock drifts?"*

Never trust the host machine, the network, or simple timeout assumptions. A simple 15-minute zombie reset fails if a stalled worker wakes up at minute 16 and overwrites the new worker's progress.

*   **Worker Heartbeats:** Require workers to emit a database heartbeat every 10 seconds while processing a job.
*   **Fencing Tokens:** Issue a monotonically increasing integer token per job attempt; reject database writes from older tokens.
*   **Key Quarantine:** Catch `HTTP 429` and `5xx` errors, quarantine the failing API key in memory with a TTL, and failover instantly.
*   **Stream Timeouts:** Enforce strict socket connect and token-stream read timeouts so hung TCP connections never freeze worker threads.

---

### Layer 2: Kinetic & Cognitive Human Paranoia
**Objective:** Physically prevent users and developers from breaking the system through haste, confusion, or bad configuration.
**Core Prompt:** *"How will an impatient user or a sleep-deprived developer accidentally weaponize this interface?"*

Checking for an existing MD5 hash in application code before inserting a job fails when 50 clicks arrive within the same millisecond—all 50 read checks pass simultaneously before the first write completes. Enforce constraints atomically at the storage layer.

*   **Atomic Deduplication:** Enforce a unique database index on the workspace ID and payload SHA-256 hash using `ON CONFLICT DO NOTHING`.
*   **Config Sanitization:** Strip whitespace, filter empty strings, and validate key prefixes at boot before accepting `.env` arrays.
*   **Boot-Time Fail-Fast:** Crash the server immediately on startup if required environment variables are missing or malformed.

---

### Layer 3: Adversarial & Byzantine Paranoia
**Objective:** Defend against malicious actors, weaponized payloads, and lying upstream dependencies.
**Core Prompt:** *"How would an attacker or a hallucinating upstream API exploit this exact code path?"*

Assume every external input—including responses from third-party APIs and LLMs—is actively trying to exhaust memory, inject commands, or corrupt state.

*   **Payload Bounds:** Reject URLs resolving to private IP ranges (SSRF protection) and cap response stream sizes to prevent memory bombs.
*   **Output Verification:** Never trust LLM output formatting; validate all returned JSON against a strict schema before downstream execution.
*   **Prompt Isolation:** Wrap untrusted user text in structural delimiters and strip control tokens before LLM synthesis.

---

### Layer 4: Temporal & Scale Decay Paranoia
**Objective:** Prevent logic that works on Day 1 from collapsing at $100\times$ volume on Day 180.
**Core Prompt:** *"What happens when this table hits 50 million rows or traffic spikes $100\times$ in 5 seconds?"*

Code that passes unit tests often hides unbounded memory growth, full-table scans, or connection pool starvation over time.

*   **Skip-Locked Polling:** Use `SELECT ... FOR UPDATE SKIP LOCKED` with indexed status columns so 100 workers never lock each other.
*   **Bounded Concurrency:** Enforce strict semaphore limits on concurrent outbound LLM calls per worker to prevent file-descriptor exhaustion.
*   **State Compaction:** Archive or TTL-expire completed job logs automatically so operational queries remain sub-millisecond forever.

---

### Layer 5: Second-Order & Cascading Collapse Paranoia
**Objective:** Ensure your defensive mechanisms do not accidentally trigger a system-wide meltdown.
**Core Prompt:** *"How will my own retry logic or recovery mechanism destroy the cluster during an outage?"*

If a specific job causes an Out-Of-Memory (OOM) crash, a naive Layer 1 zombie-recovery script will reset it to `pending` forever—crashing every worker in your fleet in a continuous loop.

*   **Dead-Letter Queues (DLQ):** Increment an `attempt_count` *before* execution begins; route jobs exceeding 3 crashes directly to a Dead-Letter Queue.
*   **Jittered Backoff:** Add randomized jitter to all retry timers so recovering workers do not hammer the database in synchronized waves.
*   **Circuit Breakers:** Trip a global circuit breaker if all API keys in the pool enter quarantine simultaneously, shedding load gracefully.

---

### Layer 6: Epistemic & Silent-Failure Paranoia
**Objective:** Eliminate invisible corruption and false-positive success states.
**Core Prompt:** *"How could this system return HTTP 200 OK while silently destroying data?"*

The most dangerous failure is the one that logs no errors. Every state transition must leave an auditable, verifiable trail.

*   **Zero-Row Assertions:** Assert that database update queries actually mutated $> 0$ rows before reporting task completion.
*   **Semantic Validation:** Verify that scraped or synthesized output contains meaningful content rather than saving a `200 OK` Cloudflare block page.
*   **Correlation Tracing:** Attach a deterministic `trace_id` to every job, log line, and LLM request for instant root-cause reconstruction.

---

## The Pre-Merge Crucible

Every pull request must verify compliance against this progression matrix before merging into production:

| Layer | Primary Threat | Naive Defense Flaw | Sovereign Requirement |
| :--- | :--- | :--- | :--- |
| **0: Core** | Broken mechanics | Untyped spaghetti state | Pure state machine |
| **1: Infra** | Process or network death | Fixed timeout overwrites | Heartbeats and fencing tokens |
| **2: Human** | Rapid clicks and typos | App-level check race condition | Atomic DB unique constraints |
| **3: Byzantine** | Malicious or bad payloads | Trusting LLM or user data | Schema and SSRF enforcement |
| **4: Scale** | Unbounded growth | Unindexed polling loops | `SKIP LOCKED` and TTL archival |
| **5: Cascade** | Poison pills and retry storms | Infinite zombie crash loops | Dead-letter queues and jitter |
| **6: Epistemic** | Silent data corruption | Swallowed exceptions | Invariant assertions and traces |