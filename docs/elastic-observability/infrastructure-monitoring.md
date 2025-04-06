# Infrastructure Monitoring

Infrastructure monitoring in Elastic Observability provides comprehensive visibility into the health, performance, and availability of your entire infrastructure stack.

## Overview

Elastic infrastructure monitoring collects metrics from hosts, virtual machines, containers, Kubernetes clusters, and cloud services. This data enables you to:

- Identify performance bottlenecks across your infrastructure
- Pinpoint resource-constrained systems
- Track capacity utilization trends
- Correlate infrastructure issues with application problems

## Key Capabilities

### Host Monitoring

Monitor all aspects of your physical and virtual hosts:

- CPU, memory, and disk utilization
- Network traffic and IO statistics
- Running processes and service status
- Host uptime and availability

### Container Monitoring

Comprehensive visibility into containerized environments:

- Container resource usage and limits
- Container lifecycle events
- Image and registry information
- Container health metrics

### Kubernetes Monitoring

Deep Kubernetes observability:

- Pod and node metrics
- Control plane monitoring
- Namespace and workload performance
- Auto-discovery of new services

### Cloud Infrastructure

Monitor cloud resources across providers:

- AWS, Azure, GCP service metrics
- Cloud instance performance
- Load balancer and network metrics
- Billing and usage insights

## Getting Started

### Prerequisites

- Elasticsearch and Kibana deployed and accessible
- Elastic Agent installed on target hosts or Kubernetes clusters

### Installation

1. Install the Elastic Agent:

```bash
# For Linux/macOS
curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.10.0-darwin-x86_64.tar.gz
tar xzvf elastic-agent-8.10.0-darwin-x86_64.tar.gz
cd elastic-agent-8.10.0-darwin-x86_64
sudo ./elastic-agent install
```

2. In Kibana, navigate to Management → Integrations
3. Find and install the System integration for host monitoring
4. For Kubernetes, install the Kubernetes integration
5. Configure data collection settings as needed

## Dashboards and Visualizations

Elastic provides pre-built dashboards for infrastructure monitoring:

- **Infrastructure Overview**: High-level status of all monitored systems
- **Host Overview**: Detailed metrics for individual hosts
- **Kubernetes Monitoring**: Pod, container, and node metrics
- **Container Monitoring**: Standalone container metrics

## Advanced Configuration

### Custom Metrics Collection

To collect custom metrics:

1. Navigate to the integration settings
2. Add custom metrics collection rules
3. Specify metrics endpoints and collection intervals

### Metric Transformations

Process and enrich metrics with ingest pipelines:

1. Define an ingest pipeline in Elasticsearch
2. Configure the integration to use the pipeline
3. Apply transformations like unit conversion or field addition

## Troubleshooting

Common issues and solutions:

- **Missing metrics**: Verify agent status with `elastic-agent status`
- **High cardinality issues**: Adjust your metric collection to reduce label cardinality
- **Agent connection problems**: Check network connectivity to Elasticsearch

## Next Steps

- Set up [alerts](./alerting-detection.md) for infrastructure metrics
- Correlate infrastructure issues with [application performance](./application-monitoring.md)
- Implement [log analytics](./log-analytics.md) alongside metrics
