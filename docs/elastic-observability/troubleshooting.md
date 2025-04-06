# Troubleshooting Elastic Observability

This guide provides systematic approaches to diagnose and resolve common issues encountered in Elastic Observability deployments.

## Elasticsearch Issues

### Cluster Health Problems

**Red Cluster Status**

_Symptoms:_

- Cluster status shows red in Kibana or API responses
- Some data unavailable
- Failed API calls

_Troubleshooting Steps:_

1. Check cluster health with detailed output:
   ```
   GET _cluster/health?pretty
   ```
2. Identify problem indices:
   ```
   GET _cluster/allocation/explain?pretty
   ```
3. Check for unassigned shards:
   ```
   GET _cat/shards?v&h=index,shard,prirep,state,unassigned.reason
   ```

_Common Solutions:_

- Increase storage if disk space is low
- Fix network connectivity between nodes
- Reduce shard count for overallocated indices
- Restart failed nodes if they're offline

**Yellow Cluster Status**

_Symptoms:_

- Cluster status shows yellow
- All data accessible but cluster not optimal
- Replica shards unassigned

_Troubleshooting Steps:_

1. Check unassigned shards:
   ```
   GET _cat/shards?v&h=index,shard,prirep,state,unassigned.reason&s=state
   ```
2. Review allocation issues:
   ```
   GET _cluster/allocation/explain?pretty
   ```

_Common Solutions:_

- Add more nodes if capacity is the issue
- Adjust replication factor if too high for cluster size
- Fix node-to-node connectivity issues
- Review shard allocation filtering

### Performance Issues

**Slow Search Queries**

_Symptoms:_

- Dashboard loading takes excessive time
- Search API calls timeout
- High CPU usage during queries

_Troubleshooting Steps:_

1. Enable and check slow logs:
   ```
   PUT /my_index/_settings
   {
     "index.search.slowlog.threshold.query.warn": "1s",
     "index.search.slowlog.threshold.fetch.warn": "500ms"
   }
   ```
2. Review slow log output:
   ```
   GET _nodes/stats/indices/search_slowlog
   ```
3. Profile problematic queries:
   ```
   GET /my_index/_search
   {
     "profile": true,
     "query": { ... }
   }
   ```

_Common Solutions:_

- Optimize queries by adding time constraints
- Add more specific field filters
- Increase shard size to reduce shard count
- Add more CPU resources to data nodes
- Consider using ingest nodes for heavy transformations

**High Indexing Latency**

_Symptoms:_

- Data appears in indices with significant delay
- Indexing metrics show high latency
- CPU or memory pressure during indexing

_Troubleshooting Steps:_

1. Check indexing stats:
   ```
   GET _nodes/stats/indices/indexing
   ```
2. Monitor thread pool usage:
   ```
   GET _nodes/stats/thread_pool
   ```
3. Examine memory pressure:
   ```
   GET _nodes/stats/os/mem,process/mem
   ```

_Common Solutions:_

- Reduce concurrent indexing requests
- Increase refresh interval for write-heavy indices
- Add more ingest or data nodes
- Optimize document structure to reduce complexity
- Increase queue sizes for indexing thread pools

## Kibana Issues

### Connection Problems

**Cannot Connect to Elasticsearch**

_Symptoms:_

- Kibana shows "Unable to connect to Elasticsearch"
- No data appears in visualizations
- Error messages about cluster connectivity

_Troubleshooting Steps:_

1. Check Kibana logs:
   ```
   journalctl -u kibana
   ```
2. Verify Elasticsearch status:
   ```
   curl -X GET "localhost:9200/_cluster/health?pretty"
   ```
3. Test network connectivity:
   ```
   curl -v "http://elasticsearch:9200"
   ```

_Common Solutions:_

- Fix Elasticsearch URL in Kibana configuration
- Ensure Elasticsearch is running
- Check network/firewall settings
- Verify credentials if authentication is enabled
- Check TLS/SSL settings if secure communication is configured

**Dashboard Loading Errors**

_Symptoms:_

- Dashboards fail to load
- Specific visualizations show errors
- Console errors in browser

_Troubleshooting Steps:_

1. Check browser console for specific errors
2. Examine Kibana logs for error messages
3. Test individual visualizations
4. Check Kibana server status:
   ```
   GET /api/status
   ```

_Common Solutions:_

- Recreate problematic visualizations
- Check index patterns match available indices
- Verify field mappings for visualized fields
- Clear browser cache
- Update Kibana if using outdated version

### Visualization Problems

**Missing Data in Visualizations**

_Symptoms:_

- Visualizations show "No results found"
- Data appears incomplete
- Date ranges don't show expected data

_Troubleshooting Steps:_

1. Verify data exists in indices:
   ```
   GET my_index/_search
   {
     "size": 0,
     "aggs": {
       "count_over_time": {
         "date_histogram": {
           "field": "@timestamp",
           "calendar_interval": "day"
         }
       }
     }
   }
   ```
2. Check index pattern definition
3. Verify time filter settings in dashboard

_Common Solutions:_

- Adjust time range to match data availability
- Update index patterns
- Check field mappings in visualization settings
- Verify data is being correctly indexed
- Review any applied dashboard filters

**High Cardinality Fields**

_Symptoms:_

- "The request exceeded the maximum number of buckets" error
- Visualization rendering slowly or failing
- Browser memory consumption spikes

_Troubleshooting Steps:_

1. Identify high cardinality fields in aggregations
2. Check configured bucket limits:
   ```
   GET _cluster/settings?include_defaults=true&filter_path=**.search.max_buckets
   ```

_Common Solutions:_

- Increase max bucket setting if appropriate:
  ```
  PUT _cluster/settings
  {
    "persistent": {
      "search.max_buckets": 20000
    }
  }
  ```
- Use terms aggregation with lower size parameter
- Filter data before aggregating
- Use filters aggregation instead of high-cardinality terms
- Consider downsampling data for visualizations

## APM Issues

### Agent Connection Problems

**Agent Not Sending Data**

_Symptoms:_

- No data appears in APM UI
- Services not visible in service map
- Agent logs show connection errors

_Troubleshooting Steps:_

1. Check agent configuration:
   ```javascript
   // Node.js example
   console.log(apm.getCurrentTraceparent()); // Should output a trace ID if working
   ```
2. Verify connectivity to APM Server:
   ```
   curl -v http://apm-server:8200/
   ```
3. Examine agent logs for errors
4. Check APM Server logs:
   ```
   journalctl -u apm-server
   ```

_Common Solutions:_

- Update server URL in agent configuration
- Check network/firewall settings
- Verify APM Server is running
- Ensure proper API keys or tokens are configured
- Update agent to compatible version

**Missing Spans or Transactions**

_Symptoms:_

- Incomplete traces in APM UI
- Missing service dependencies
- Distributed traces not connected

_Troubleshooting Steps:_

1. Enable debug logging in agent:
   ```
   # Java example
   -Delastic.apm.log_level=DEBUG
   ```
2. Check trace context propagation
3. Verify service name consistency

_Common Solutions:_

- Ensure consistent service naming
- Verify trace context headers are propagated
- Check instrumentation coverage
- Update agent to latest version
- Reduce sampling rate if dropping data due to volume

### Performance Impact

**High Agent Overhead**

_Symptoms:_

- Application performance degrades with agent enabled
- Increased CPU or memory consumption
- Slower response times

_Troubleshooting Steps:_

1. Measure application with and without agent
2. Check agent configuration for excessive instrumentation
3. Examine agent logs for bottlenecks
4. Review transaction sample rate

_Common Solutions:_

- Reduce transaction sample rate:
  ```
  # Node.js example
  {
    transactionSampleRate: 0.1 // 10% sampling
  }
  ```
- Disable unnecessary instrumentation
- Update to latest agent version
- Increase span min duration to filter short spans
- Use Central Configuration to tune sampling dynamically

## Log Collection Issues

### Missing Logs

**Filebeat Not Collecting Logs**

_Symptoms:_

- Logs missing from Kibana
- No errors but data not visible
- Filebeat running but not shipping logs

_Troubleshooting Steps:_

1. Check Filebeat status:
   ```
   filebeat status
   ```
2. Enable debug logging:
   ```
   filebeat -e -d "*"
   ```
3. Verify file permissions
4. Test Elasticsearch connection:
   ```
   filebeat test output
   ```

_Common Solutions:_

- Fix file permissions to allow reading logs
- Update file path patterns
- Adjust multiline settings
- Restart Filebeat to detect new files
- Check Elasticsearch connectivity and authentication

**Log Parsing Errors**

_Symptoms:_

- Logs appear with incorrect structure
- Fields not properly extracted
- @timestamp field missing or incorrect

_Troubleshooting Steps:_

1. Examine sample documents in Elasticsearch:
   ```
   GET my-logs-*/_search
   ```
2. Check Ingest pipeline processing:
   ```
   POST _ingest/pipeline/_simulate
   {
     "pipeline": {
       "processors": [...]
     },
     "docs": [
       {"_source": {"message": "sample log message"}}
     ]
   }
   ```
3. Verify grok patterns match actual log format

_Common Solutions:_

- Update grok patterns to match log format
- Fix timestamp parsing configuration
- Use multiple processors for complex logs
- Implement field mappings before ingestion
- Test pipeline with sample logs before deployment

## Metric Collection Issues

### Missing Metrics

**Metricbeat Not Reporting Data**

_Symptoms:_

- Metrics missing from Kibana visualizations
- No data in metrics indices
- System metrics incomplete

_Troubleshooting Steps:_

1. Check Metricbeat status:
   ```
   metricbeat status
   ```
2. Verify module configuration:
   ```
   metricbeat modules list
   ```
3. Test output connectivity:
   ```
   metricbeat test output
   ```
4. Enable debug logging:
   ```
   metricbeat -e -d "*"
   ```

_Common Solutions:_

- Enable required modules
- Fix connection settings to monitored services
- Update authentication credentials
- Verify permissions to read metrics
- Check Elasticsearch connectivity and authentication

**Kubernetes Metrics Missing**

_Symptoms:_

- Pod or node metrics unavailable
- Kubernetes dashboards empty
- kube-state-metrics not reporting

_Troubleshooting Steps:_

1. Check Kubernetes integration status:
   ```
   kubectl get pods -n kube-system | grep metricbeat
   ```
2. Verify RBAC permissions
3. Check kube-state-metrics availability:
   ```
   kubectl get pods -n kube-system | grep kube-state
   ```
4. Examine Metricbeat logs:
   ```
   kubectl logs -n kube-system -l k8s-app=metricbeat
   ```

_Common Solutions:_

- Fix RBAC roles and bindings
- Ensure kube-state-metrics is deployed
- Update Kubernetes API endpoints
- Redeploy Metricbeat with correct configuration
- Check Kubernetes version compatibility

## Alerting Issues

### Failed Alerts

**Alerts Not Triggering**

_Symptoms:_

- Expected alerts don't fire
- Conditions met but no notifications
- Alert status shows "not triggered"

_Troubleshooting Steps:_

1. Check alert rule definition
2. Verify conditions match actual data
3. Examine alert execution logs:
   ```
   GET .kibana-event-log-*/_search
   {
     "query": {
       "match": {
         "rule.id": "your-rule-id"
       }
     }
   }
   ```
4. Test alert conditions manually

_Common Solutions:_

- Adjust threshold values
- Fix query syntax in alert condition
- Check index pattern matches data sources
- Verify time field configuration
- Ensure alerting user has access to indices

**Alert Notifications Not Sent**

_Symptoms:_

- Alerts trigger but no notifications received
- Action history shows failures
- Email/Slack/other notifications missing

_Troubleshooting Steps:_

1. Check connector configuration
2. Verify connectivity to notification service
3. Test connector:
   ```
   POST /api/actions/connector/{{connector_id}}/_execute
   {
     "params": {
       "message": "This is a test message"
     }
   }
   ```
4. Check action execution logs

_Common Solutions:_

- Update connector credentials
- Fix network connectivity to notification service
- Adjust rate limiting on notification service
- Update webhook URLs or email addresses
- Check for content filtering or blocking

## Fleet and Agent Issues

### Agent Management Problems

**Agents Not Enrolling in Fleet**

_Symptoms:_

- Agents don't appear in Fleet UI
- Failed enrollment messages
- Agent running but not connected

_Troubleshooting Steps:_

1. Check enrollment token validity
2. Verify Fleet Server connectivity:
   ```
   curl -v https://fleet-server:8220/api/status
   ```
3. Examine agent logs:
   ```
   cat /var/log/elastic-agent/elastic-agent.log
   ```
4. Test enrollment manually:
   ```
   elastic-agent enroll --url=https://fleet-server:8220 --enrollment-token=TOKEN
   ```

_Common Solutions:_

- Generate new enrollment token
- Fix Fleet Server URL in agent configuration
- Check network/firewall settings
- Verify TLS/SSL certificate validity
- Ensure proper clock synchronization

**Policy Not Applied to Agents**

_Symptoms:_

- Agent enrolled but policy not applied
- Data not appearing from specific integrations
- Agent showing as "updating" indefinitely

_Troubleshooting Steps:_

1. Check agent status:
   ```
   elastic-agent status
   ```
2. Examine agent logs for policy updates
3. Verify agent is healthy in Fleet UI
4. Check for policy conflicts or invalid settings

_Common Solutions:_

- Force agent policy reassignment
- Restart agent to fetch latest policy
- Fix configuration errors in policy
- Check for network issues preventing policy download
- Update agent to latest version

## Advanced Troubleshooting

### Diagnostic Data Collection

**Gathering System Information**

1. Collect Elasticsearch diagnostics:

   ```
   GET _nodes/stats
   GET _cluster/allocation/explain
   GET _cat/indices?v
   GET _cat/shards?v
   ```

2. Collect agent diagnostics:

   ```
   elastic-agent diagnostics
   metricbeat test config
   filebeat test config
   ```

3. OS-level diagnostics:
   ```
   top -b -n 1
   df -h
   free -m
   netstat -tuln
   ```

**Creating Support Bundles**

1. Elasticsearch Support Bundle:

   ```
   POST /_nodes/all/_support/diagnostic
   ```

2. Kibana Support Bundle:
   Navigate to Management → Stack Monitoring → Kibana → Generate Support Ticket

3. Agent Support Bundle:
   ```
   elastic-agent diagnostics collect
   ```

### Recovery Procedures

**Recovering from Cluster Red Status**

1. Address unassigned shards:

   ```
   POST /_cluster/reroute?retry_failed=true
   ```

2. Force allocation of stuck shards:

   ```
   POST /_cluster/reroute
   {
     "commands": [
       {
         "allocate_stale_primary": {
           "index": "my-index",
           "shard": 0,
           "node": "node-name",
           "accept_data_loss": true
         }
       }
     ]
   }
   ```

3. Remove problematic indices if necessary:
   ```
   DELETE /problematic-index
   ```

**Recovering from Disk Full Errors**

1. Enable read-only mode temporarily:

   ```
   PUT _cluster/settings
   {
     "persistent": {
       "cluster.blocks.read_only_allow_delete": true
     }
   }
   ```

2. Free up disk space:

   - Delete old indices
   - Remove old snapshots
   - Increase storage capacity

3. Disable read-only mode:
   ```
   PUT _cluster/settings
   {
     "persistent": {
       "cluster.blocks.read_only_allow_delete": null
     }
   }
   ```

## Common Error Messages

### Elasticsearch Errors

| Error Message                                                      | Likely Cause                                | Solution                                                     |
| ------------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------ |
| `circuit_breaking_exception`                                       | Memory usage exceeds circuit breaker limits | Increase JVM heap, optimize queries, add nodes               |
| `ClusterBlockException[blocked by: [FORBIDDEN/12/index read-only]` | Disk space full                             | Free disk space, increase storage, remove old data           |
| `maximum shards open`                                              | Too many shards open                        | Increase `cluster.max_shards_per_node`, reduce shard count   |
| `EsRejectedExecutionException`                                     | Thread pool queue full                      | Increase queue size, add nodes, reduce concurrent requests   |
| `SearchPhaseExecutionException`                                    | Error during search execution               | Check query syntax, verify field mappings, increase timeouts |

### Kibana Errors

| Error Message                                                  | Likely Cause                              | Solution                                                 |
| -------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `Unable to connect to Elasticsearch at http://localhost:9200.` | Elasticsearch not running or inaccessible | Check Elasticsearch status, fix connection settings      |
| `Request Timeout after 30000ms`                                | Query taking too long                     | Optimize query, increase timeout settings                |
| `x of y shards failed`                                         | Some shards unavailable                   | Check Elasticsearch cluster health, fix shard allocation |
| `No Living connections`                                        | Network issues to Elasticsearch           | Check network, firewall settings, Elasticsearch status   |
| `This request exceeded the maximum number of buckets`          | Too many buckets in aggregation           | Reduce cardinality, increase max bucket setting          |

### Agent Errors

| Error Message                                             | Likely Cause                  | Solution                                                  |
| --------------------------------------------------------- | ----------------------------- | --------------------------------------------------------- |
| `fail to enroll: fail to execute request to fleet-server` | Cannot reach Fleet Server     | Check network, Fleet Server URL, certificate validity     |
| `Got permission denied while trying to access logs`       | Insufficient permissions      | Fix file permissions, run agent as appropriate user       |
| `Exiting: error loading config file`                      | Invalid configuration         | Fix syntax errors in configuration, verify file path      |
| `failed to watch directory: too many open files`          | File descriptor limit too low | Increase system file descriptor limits                    |
| `harvester could not be started on file`                  | File access issues            | Check file permissions, existence, and file system status |

## Next Steps

- Review [Best Practices](./best-practices.md) to prevent common issues
- Implement [Monitoring](./infrastructure-monitoring.md) to detect problems earlier
- Set up [Alerting](./alerting-detection.md) for proactive issue detection
- Explore [Performance Tuning](./performance-tuning.md) for better efficiency
- Consider [Backup and Recovery](./backup-recovery.md) procedures
