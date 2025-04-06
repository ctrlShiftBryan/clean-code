# Log Analytics

Log analytics in Elastic Observability enables comprehensive collection, processing, and analysis of log data from across your entire technology stack.

## Overview

Elastic log analytics provides powerful capabilities for:

- Centralized log collection from diverse sources
- Real-time log processing and enrichment
- Full-text search and structured querying
- Pattern detection and anomaly identification
- Correlation with metrics and traces
- Long-term log retention and compliance

## Log Sources

Elastic can collect logs from virtually any source:

### Infrastructure Logs

- Operating system logs (syslog, Windows Event Log)
- Container logs (Docker, containerd)
- Kubernetes logs (pod, node, control plane)
- Cloud provider logs (AWS CloudTrail, Azure Activity Logs, GCP Audit Logs)

### Application Logs

- Application server logs (Tomcat, Nginx, Apache)
- Programming language logs (Java, Python, Node.js)
- Database logs (MySQL, PostgreSQL, MongoDB)
- Middleware logs (Kafka, RabbitMQ, Redis)

### Security Logs

- Authentication logs
- Firewall and network device logs
- Endpoint detection logs
- Cloud security logs

## Key Features

### Log Collection

Multiple ways to collect logs:

- **Elastic Agent**: The recommended method for most use cases
- **Beats**: Lightweight shippers for specific data types (Filebeat, Winlogbeat)
- **API Ingestion**: Direct HTTP(S) ingestion
- **Cloud Integrations**: Native connections to cloud provider logging services

### Log Processing

Transform and enrich logs in real-time:

- Field extraction
- Timestamp normalization
- Geoip enrichment
- User agent parsing
- Event categorization
- Data masking for compliance

### Log Analysis

Powerful tools for exploring log data:

- Full-text search with Elasticsearch
- Structured queries with Kibana Query Language (KQL)
- Saved searches and filters
- Log patterns and frequency analysis
- Anomaly detection with Machine Learning

### Log Visualization

Interpret log data effectively:

- Logs Explorer interface
- Custom visualizations and dashboards
- Timeline views
- Aggregations and histograms
- Trace-to-logs correlation

## Getting Started

### Prerequisites

- Elasticsearch and Kibana deployed
- Elastic Agent or relevant Beats installed

### Basic Log Collection

1. **Configure Elastic Agent**:

   In Kibana, navigate to Management → Fleet → Agent policies → Add integration

   Select the relevant log source integration:

   - System logs
   - Nginx logs
   - Cloud provider logs
   - Custom logs

2. **For custom log files**:

   Configure log paths and formats:

   ```yaml
   filebeat.inputs:
     - type: log
       enabled: true
       paths:
         - /var/log/myapp/*.log
       json.keys_under_root: true
       json.add_error_key: true
   ```

3. **Deploy the configuration**:

   Install Elastic Agent on your hosts or use Fleet to manage deployments.

### Viewing and Analyzing Logs

1. In Kibana, navigate to **Observability → Logs**
2. Use the search bar to find specific log entries
3. Filter logs by fields like `host.name`, `log.level`, or any custom field
4. Create visualizations or dashboards to monitor log patterns

## Advanced Configuration

### Custom Log Parsing

For non-standard log formats, configure processors:

```yaml
processors:
  - dissect:
      field: 'message'
      pattern: '%{timestamp} %{log.level} [%{thread}] %{class}: %{msg}'
  - timestamp:
      field: 'timestamp'
      target_field: '@timestamp'
      formats:
        - 'yyyy-MM-dd HH:mm:ss,SSS'
```

### Log Enrichment

Add context to your logs with enrichment:

```yaml
processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~
```

### Log Routing

Send different logs to different destinations:

```yaml
output.elasticsearch:
  hosts: ['https://elasticsearch:9200']
  indices:
    - index: 'app-%{[event.dataset]}-%{+yyyy.MM.dd}'
      when.contains:
        event.dataset: 'application'
    - index: 'system-%{[event.dataset]}-%{+yyyy.MM.dd}'
      when.contains:
        event.dataset: 'system'
```

## Best Practices

### Performance Optimization

- Use index lifecycles to manage log retention
- Implement rollover policies for large log volumes
- Consider data tiers for hot/warm/cold storage
- Tune resource allocation based on log volume

### Structured Logging

Implement structured logging in applications:

```javascript
// Node.js example with winston
const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [new winston.transports.File({ filename: 'application.log' })],
});

logger.info('User login', { userId: 'user123', loginTime: new Date() });
```

### Security and Compliance

- Implement field-level security for sensitive logs
- Use data masking for PII and regulated data
- Set up appropriate retention policies
- Create audit trails for log access

## Troubleshooting

Common issues and solutions:

- **Missing logs**: Check agent status and connectivity
- **Parsing errors**: Validate log format against parsing rules
- **High volume handling**: Implement sampling or filtering for verbose logs
- **Performance issues**: Check Elasticsearch resource allocation

## Next Steps

- Set up [Alerting](./alerting-detection.md) for important log patterns
- Correlate logs with [APM data](./application-monitoring.md)
- Implement [Machine Learning](./machine-learning.md) for log anomaly detection
