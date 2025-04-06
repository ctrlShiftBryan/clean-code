# Custom Integrations

Custom integrations in Elastic Observability allow you to extend the platform's capabilities to collect, process, and visualize data from any application or service that isn't covered by built-in integrations.

## Overview

Custom integrations enable you to:

- Collect data from proprietary or custom applications
- Define specific data processing pipelines
- Create tailored visualizations and dashboards
- Standardize monitoring across unique systems
- Share integrations across your organization

## Types of Custom Integrations

### Input-Based Integrations

Extensions that collect data from various sources:

- **HTTP API**: Collect data from REST, GraphQL, or SOAP APIs
- **Custom Logs**: Parse and process custom log formats
- **TCP/UDP**: Listen for data on network ports
- **Script Output**: Run scripts and collect their output
- **JMX**: Collect metrics from Java applications

### Transformation Integrations

Custom processing of collected data:

- **Ingest Pipelines**: Transform and enrich data as it's ingested
- **Custom Field Mappings**: Define specific field types and relations
- **Calculated Metrics**: Create derived metrics from raw data
- **Data Enrichment**: Add context from external sources

### Visualization Integrations

Custom ways to view and interpret data:

- **Custom Dashboards**: Tailored visualization layouts
- **Specialized Visualizations**: Application-specific data views
- **Business Metrics**: KPIs derived from technical data
- **Integrated Alerting**: Custom thresholds and conditions

## Creating Custom Integrations

### Building a Custom HTTP API Integration

1. In Kibana, navigate to **Management → Fleet → Integrations**
2. Click **Upload integration** (or create from scratch if using dev tools)
3. Define the integration package:

```yaml
# manifest.yml
name: my_custom_api
version: 1.0.0
categories: ['custom']
description: Custom API integration for my application
type: integration
```

4. Create the HTTP input configuration:

```yaml
# data_stream/api-metrics/manifest.yml
type: metrics
dataset: my_custom_api.metrics
title: My Custom API Metrics
```

5. Define the data collection:

```yaml
# data_stream/api-metrics/agent/input/config.yml
- name: my_custom_api
  type: http/metrics
  enabled: true
  streams:
    - data_stream:
        dataset: my_custom_api.metrics
      interval: 60s
      request.method: GET
      request.url: https://api.myapp.com/metrics
      request.headers:
        Authorization: 'Bearer ${auth_token}'
      response.request_body_on_pagination: false
      response.pagination:
        enabled: false
      processors:
        - decode_json_fields:
            fields: ['message']
            target: 'json'
        - convert:
            fields:
              - {
                  from: 'json.cpu_usage',
                  to: 'system.cpu.usage',
                  type: 'float',
                }
              - {
                  from: 'json.memory_usage',
                  to: 'system.memory.usage',
                  type: 'float',
                }
```

6. Create dashboards and visualizations
7. Package and deploy the integration

### Building Custom Log Processing

1. Create a custom log pattern definition:

```yaml
# my_app_logs.yml
type: log
paths:
  - /var/log/myapp/*.log
exclude_files: ['.gz$']
multiline:
  pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}'
  negate: true
  match: after
processors:
  - dissect:
      tokenizer: '%{timestamp} [%{level}] %{service} - %{message}'
  - timestamp:
      field: timestamp
      layouts:
        - '2006-01-02 15:04:05'
      target_field: '@timestamp'
  - add_fields:
      target: ''
      fields:
        log.level: '%{[level]}'
        service.name: '%{[service]}'
```

2. Apply this configuration to your Elastic Agent policy:

```yaml
inputs:
  - type: logfile
    streams:
      - data_stream:
          type: logs
          dataset: my_custom_app
        paths:
          - /var/log/myapp/*.log
        multiline:
          pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
          negate: true
          match: after
        processors:
          - dissect:
              tokenizer: '%{timestamp} [%{level}] %{service} - %{message}'
          - timestamp:
              field: timestamp
              layouts:
                - '2006-01-02 15:04:05'
              target_field: '@timestamp'
```

### Building a Custom JMX Integration

1. Create a JMX configuration for monitoring Java applications:

```yaml
# jmx_config.yml
inputs:
  - type: jolokia
    streams:
      - data_stream:
          type: metrics
          dataset: my_java_app
        host: localhost
        port: 8778
        namespace: java.lang
        metrics:
          - name: Memory
            mbean: 'java.lang:type=Memory'
            attributes:
              - attr: HeapMemoryUsage
                field: jvm.memory.heap
              - attr: NonHeapMemoryUsage
                field: jvm.memory.non_heap
          - name: Threading
            mbean: 'java.lang:type=Threading'
            attributes:
              - attr: ThreadCount
                field: jvm.threads.count
```

2. Apply this configuration to your Elastic Agent policy

## Custom Ingest Pipelines

For advanced data processing, create custom ingest pipelines:

1. In Kibana, navigate to **Management → Dev Tools**
2. Create a custom ingest pipeline:

```json
PUT _ingest/pipeline/my_custom_pipeline
{
  "description": "Process custom application data",
  "processors": [
    {
      "grok": {
        "field": "message",
        "patterns": ["%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:log.level} %{NOTSPACE:thread} %{JAVACLASS:logger} - %{GREEDYDATA:message}"]
      }
    },
    {
      "date": {
        "field": "timestamp",
        "formats": ["ISO8601"]
      }
    },
    {
      "geoip": {
        "field": "client.ip",
        "target_field": "client.geo"
      }
    },
    {
      "script": {
        "lang": "painless",
        "source": "if (ctx.response_time != null) { ctx.response_time_ms = ctx.response_time * 1000 }"
      }
    }
  ]
}
```

3. Reference this pipeline in your data input configuration:

```yaml
# In your agent configuration
processors:
  - pipeline:
      name: my_custom_pipeline
```

## Sharing Custom Integrations

### Creating Integration Packages

1. Create the package structure:

```
my_custom_integration/
├── manifest.yml
├── docs/
│   └── README.md
├── img/
│   └── logo.svg
├── data_stream/
│   ├── metrics/
│   │   ├── manifest.yml
│   │   ├── fields/
│   │   │   └── fields.yml
│   │   └── agent/
│   │       └── input/
│   │           └── config.yml
│   └── logs/
│       ├── manifest.yml
│       ├── elasticsearch/
│       │   └── ingest_pipeline/
│       │       └── default.yml
│       └── agent/
│           └── input/
│               └── config.yml
└── kibana/
    ├── dashboard/
    │   └── my-custom-dashboard.json
    └── visualization/
        └── my-custom-visualization.json
```

2. Package the integration:

```bash
# Using the elastic-package tool
elastic-package build
```

3. Share the integration:
   - Upload to your organization's artifact repository
   - Share via Fleet's custom integration upload
   - Contribute to the Elastic Integrations repository

## Advanced Custom Integration Techniques

### Custom Data Correlation

Link data from different sources:

```yaml
processors:
  - add_fields:
      target: ''
      fields:
        correlation_id: '${correlation_id}'
        trace.id: '${trace_id}'
```

### Custom Metrics Calculation

Calculate derived metrics from raw data:

```yaml
processors:
  - script:
      lang: painless
      source: >
        ctx.error_rate = (ctx.requests_total > 0) ? 
          (float)(ctx.errors_total / ctx.requests_total) * 100 : 0;
```

### Conditional Data Processing

Apply different processing based on data content:

```yaml
processors:
  - conditional:
      if: ctx.response_code >= 400
      then:
        - add_fields:
            target: ''
            fields:
              is_error: true
              error_type: 'http_${response_code}'
```

## Debugging Custom Integrations

### Testing Ingest Pipelines

Test pipeline processing with sample data:

```json
POST _ingest/pipeline/my_custom_pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "2023-04-15T12:34:56 ERROR main com.example.MyClass - Failed to process request",
        "client": {
          "ip": "203.0.113.42"
        },
        "response_time": 0.156
      }
    }
  ]
}
```

### Debugging Agent Data Collection

Enable debug logging for the Elastic Agent:

```yaml
# In elastic-agent.yml for standalone agents
agent.logging.level: debug
# For Fleet-managed agents, set via Fleet UI
```

### Validation Techniques

- Use the `elastic-package test` command for package testing
- Verify field mappings with `GET <index>/_mapping`
- Check ingest pipeline statistics: `GET _nodes/stats/ingest?pretty`

## Best Practices

### Integration Design

- Standardize field names using Elastic Common Schema (ECS)
- Design for scalability and performance
- Include proper documentation
- Provide sample dashboards and visualizations
- Support version upgrades and migrations

### Data Quality

- Validate and normalize data at collection time
- Handle errors gracefully
- Implement proper data type conversions
- Set appropriate field cardinality limits
- Consider data volume and storage implications

### Security Considerations

- Store sensitive configuration securely
- Implement proper authentication for data sources
- Validate and sanitize input data
- Follow least privilege principles
- Audit data access and modifications

## Next Steps

- Explore [Index Lifecycle Management](./index-lifecycle-management.md)
- Implement [Alerting](./alerting-detection.md) for custom integrations
- Build [Advanced Visualizations](./kibana-visualizations.md)
- Learn about [Custom Processors](./data-processing.md)
