# Performance Considerations

## Network Performance

### WiFi Transport
**Characteristics:**
- Latency: 5-10ms (local network)
- Throughput: 10-100 MB/s
- Range: 50-100 meters
- Concurrent connections: 50+ devices
- Reliability: TCP guarantees delivery

**Optimizations:**
- Message batching (100ms window)
- Binary protocol (MessagePack instead of JSON)
- Connection pooling
- Keep-alive pings (30s interval)

**Bottlenecks:**
- Server CPU for large groups (50+ users)
- Network congestion on shared WiFi
- Router limitations

### Bluetooth Transport
**Characteristics:**
- Latency: 50-200ms
- Throughput: 100-500 KB/s
- Range: 10-30 meters
- Concurrent connections: 7-8 devices
- Reliability: Requires retry logic

**Optimizations:**
- Adaptive scanning intervals (1s → 5s)
- Connection caching
- Message compression (gzip)
- Batch transfers

**Bottlenecks:**
- MTU limits (512 bytes typical)
- Connection establishment time (2-5s)
- Limited concurrent connections
- Battery drain

## Database Performance

### Query Optimization
```sql
-- Indexed queries (fast)
SELECT * FROM messages WHERE roomId = ? AND timestamp > ?
SELECT MAX(timestamp) FROM messages WHERE roomId = ?

-- Full table scan (slow, avoid)
SELECT * FROM messages WHERE content LIKE '%search%'
```

**Strategies:**
- Composite indexes: `(roomId, timestamp)`
- Covering indexes for common queries
- Prepared statements (reuse query plans)
- Batch inserts (100 messages at once)

### Write Performance
- **WAL Mode**: Allows concurrent reads during writes
- **Transactions**: Group related operations
- **Batch Inserts**: 10x faster than individual inserts
- **Async Operations**: Don't block UI thread

**Benchmarks:**
- Single insert: ~1ms
- Batch insert (100): ~10ms (0.1ms per message)
- Query with index: <1ms
- Query without index: 10-100ms (depends on table size)

### Storage Growth
- Average message: 500 bytes
- 10,000 messages: ~5 MB
- 100,000 messages: ~50 MB
- Images: 100-500 KB each

**Mitigation:**
- Periodic vacuum (reclaim space)
- Archive old messages
- Compress images
- Delete orphaned files

## Memory Management

### Message Loading
**Problem:** Loading 10,000 messages uses 50+ MB RAM

**Solution:** Pagination
```typescript
const PAGE_SIZE = 50;
const messages = await db.getMessages(roomId, offset, PAGE_SIZE);
```

### Image Caching
**Problem:** Full-resolution images consume memory

**Solution:** Multi-tier cache
1. Thumbnail cache (100x100): 10 KB each
2. Preview cache (500x500): 50 KB each
3. Full resolution: Load on demand

**Implementation:**
```typescript
const cache = new LRU({ max: 100 }); // Keep 100 recent images
```

### Connection Management
**Problem:** Each BLE connection uses 1-2 MB RAM

**Solution:** Connection pooling
- Maintain 3-5 active connections
- Close idle connections after 60s
- Prioritize recent peers

## CPU Optimization

### Encryption
**Cost:** AES encryption ~1ms per message

**Optimization:**
- Batch encrypt multiple messages
- Use native crypto (faster than JS)
- Cache encryption keys

### Vector Clock Operations
**Cost:** O(N) where N = number of devices

**Optimization:**
- Limit clock size (prune old entries)
- Use sparse representation
- Lazy evaluation

### Conflict Resolution
**Cost:** O(M log M) where M = messages to deduplicate

**Optimization:**
- Incremental resolution (not full history)
- Early exit on UUID match
- Parallel processing for large batches

## Battery Optimization

### Bluetooth Scanning
**Impact:** Continuous scanning drains 10-20% battery/hour

**Strategies:**
- Adaptive intervals: 1s when active, 5s when idle
- Stop scanning when connected
- Use low-power scan mode
- Batch advertisements

### Background Operation
**Impact:** Background sync drains 5-10% battery/hour

**Strategies:**
- Reduce sync frequency (30s → 60s)
- Use push notifications instead of polling
- Suspend non-critical operations
- Wake locks only when necessary

### Network Switching
**Impact:** Frequent switching wastes battery

**Strategies:**
- Hysteresis: Wait 10s before switching back
- Prefer WiFi (more efficient)
- Batch operations during active periods

## Scalability Limits

### WiFi Mode
- **50 users**: Excellent performance
- **100 users**: Good performance (some latency)
- **200+ users**: Requires server optimization
- **Bottleneck:** Server CPU and bandwidth

### Bluetooth Mode
- **3-5 users**: Excellent performance
- **7-8 users**: Good performance (connection limit)
- **10+ users**: Requires multi-hop routing
- **Bottleneck:** BLE connection limit

### Database
- **10K messages**: Instant queries
- **100K messages**: <100ms queries with indexes
- **1M+ messages**: Requires partitioning
- **Bottleneck:** Disk I/O

## Benchmarks

### Message Send Latency
| Transport | Latency | Throughput |
|-----------|---------|------------|
| WiFi LAN  | 10ms    | 1000 msg/s |
| Bluetooth | 100ms   | 10 msg/s   |

### Sync Performance
| Messages | WiFi Time | BLE Time |
|----------|-----------|----------|
| 10       | 50ms      | 500ms    |
| 100      | 200ms     | 5s       |
| 1000     | 2s        | 50s      |

### Database Operations
| Operation      | Time   |
|----------------|--------|
| Insert         | 1ms    |
| Batch (100)    | 10ms   |
| Query (index)  | <1ms   |
| Query (scan)   | 50ms   |
| Sync (1000)    | 100ms  |

## Monitoring

### Metrics to Track
- Message send latency (p50, p95, p99)
- Sync duration
- Database query time
- Memory usage
- Battery drain rate
- Connection success rate

### Profiling Tools
- React Native Performance Monitor
- Chrome DevTools
- Android Profiler
- Xcode Instruments
- SQLite EXPLAIN QUERY PLAN

## Optimization Checklist

- [ ] Enable database indexes
- [ ] Use WAL mode for SQLite
- [ ] Implement message pagination
- [ ] Add image compression
- [ ] Use connection pooling
- [ ] Batch network operations
- [ ] Implement LRU caching
- [ ] Optimize BLE scanning intervals
- [ ] Add performance monitoring
- [ ] Profile critical paths
