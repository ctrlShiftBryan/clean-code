# Elastic Agent Installation Guide

Elastic Agent is a unified way to collect data from your hosts, containers, and services. This guide covers the installation, configuration, and management of Elastic Agent across various environments.

## Overview

Elastic Agent provides:

- Centralized management of data collection
- Single agent for logs, metrics, traces, and security data
- Automatic updates and configuration changes
- Integration with Elastic Fleet for agent management
- Support for multiple platforms and deployment methods

## Deployment Models

### Fleet-Managed Deployment

The recommended approach for most environments:

- Centrally managed through Kibana Fleet
- Automatic updates and configuration changes
- Policy-based management
- Agent status monitoring

### Standalone Deployment

For environments without fleet connectivity:

- Locally configured using YAML files
- Manual updates and configuration
- Suitable for air-gapped or restricted environments
- Reduced central management capabilities

## Prerequisites

Before installing Elastic Agent, ensure you have:

- Elasticsearch and Kibana deployed (version 7.14 or later)
- Network connectivity from agents to Elasticsearch/Fleet Server
- Appropriate permissions to install software on target hosts
- System requirements:
  - 256MB RAM minimum (512MB+ recommended)
  - 500MB disk space (excluding data storage)
  - 64-bit operating system

## Fleet Server Setup

For Fleet-managed deployments, first set up Fleet Server:

1. In Kibana, navigate to **Management → Fleet**
2. Click **Settings** and configure Fleet Server host and Elasticsearch connection
3. Click **Add Fleet Server** and follow the guided setup
4. Note the enrollment token for later use

## Installing Elastic Agent

### Linux Installation

#### RPM-based distributions (RHEL, CentOS, Fedora)

```bash
# Download the agent
curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.10.0-x86_64.rpm

# Install the agent
sudo rpm -vi elastic-agent-8.10.0-x86_64.rpm

# Enroll in Fleet (for Fleet-managed deployment)
sudo elastic-agent enroll --url=https://fleet-server:8220 --enrollment-token=<token>

# Start the agent
sudo systemctl start elastic-agent
```

#### DEB-based distributions (Ubuntu, Debian)

```bash
# Download the agent
curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.10.0-amd64.deb

# Install the agent
sudo dpkg -i elastic-agent-8.10.0-amd64.deb

# Enroll in Fleet (for Fleet-managed deployment)
sudo elastic-agent enroll --url=https://fleet-server:8220 --enrollment-token=<token>

# Start the agent
sudo systemctl start elastic-agent
```

#### Generic Linux (tar.gz)

```bash
# Download the agent
curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.10.0-linux-x86_64.tar.gz

# Extract the package
tar xzvf elastic-agent-8.10.0-linux-x86_64.tar.gz

# Move to appropriate location
sudo mv elastic-agent-8.10.0-linux-x86_64 /opt/elastic-agent

# Enroll in Fleet (for Fleet-managed deployment)
sudo /opt/elastic-agent/elastic-agent enroll --url=https://fleet-server:8220 --enrollment-token=<token>

# Install and start as a service
sudo /opt/elastic-agent/elastic-agent install
```

### macOS Installation

```bash
# Download the agent
curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.10.0-darwin-x86_64.tar.gz

# Extract the package
tar xzvf elastic-agent-8.10.0-darwin-x86_64.tar.gz

# Move to appropriate location
sudo mv elastic-agent-8.10.0-darwin-x86_64 /opt/elastic-agent

# Enroll in Fleet (for Fleet-managed deployment)
sudo /opt/elastic-agent/elastic-agent enroll --url=https://fleet-server:8220 --enrollment-token=<token>

# Install and start as a service
sudo /opt/elastic-agent/elastic-agent install
```

### Windows Installation

1. Download the agent from [Elastic's website](https://www.elastic.co/downloads/elastic-agent)
2. Open PowerShell as Administrator
3. Navigate to the download location
4. Run the installation commands:

```powershell
# Extract the package
Expand-Archive -Path .\elastic-agent-8.10.0-windows-x86_64.zip -DestinationPath C:\Program Files\Elastic\Agent

# Enroll in Fleet (for Fleet-managed deployment)
& 'C:\Program Files\Elastic\Agent\elastic-agent.exe' enroll --url=https://fleet-server:8220 --enrollment-token=<token>

# Install and start as a service
& 'C:\Program Files\Elastic\Agent\elastic-agent.exe' install
```

## Container and Kubernetes Deployments

### Docker Deployment

```bash
# Pull the Elastic Agent image
docker pull docker.elastic.co/beats/elastic-agent:8.10.0

# Run the agent with Fleet enrollment
docker run -d \
  --name elastic-agent \
  --restart=always \
  -e FLEET_URL=https://fleet-server:8220 \
  -e FLEET_ENROLLMENT_TOKEN=<token> \
  -e FLEET_INSECURE=false \
  --network=host \
  docker.elastic.co/beats/elastic-agent:8.10.0
```

### Kubernetes Deployment with Helm

1. Add the Elastic Helm repository:

```bash
helm repo add elastic https://helm.elastic.co
helm repo update
```

2. Create a values.yaml file:

```yaml
agent:
  version: 8.10.0
  kibana:
    host: https://kibana:5601
  fleet:
    url: https://fleet-server:8220
    enrollmentToken: <token>
```

3. Install with Helm:

```bash
helm install elastic-agent elastic/elastic-agent -f values.yaml
```

## Standalone Agent Configuration

For environments without Fleet, configure the agent locally:

1. Create an `elastic-agent.yml` file:

```yaml
outputs:
  default:
    type: elasticsearch
    hosts:
      - https://elasticsearch:9200
    username: elastic
    password: changeme

inputs:
  - type: system/metrics
    data_stream:
      namespace: default
    use_output: default
    streams:
      - metricset: cpu
        data_stream:
          dataset: system.cpu
      - metricset: memory
        data_stream:
          dataset: system.memory

  - type: system/logs
    data_stream:
      namespace: default
    use_output: default
    streams:
      - data_stream:
          dataset: system.syslog
        paths:
          - /var/log/messages*
          - /var/log/syslog*
```

2. Install and start the standalone agent:

```bash
sudo elastic-agent install -c elastic-agent.yml
```

## Agent Management

### Checking Agent Status

```bash
# For system service installations
sudo elastic-agent status

# View detailed status
sudo elastic-agent diagnostics
```

### Restarting the Agent

```bash
# For system service installations
sudo systemctl restart elastic-agent
```

### Upgrading the Agent

For Fleet-managed agents, upgrades can be performed through Kibana:

1. Navigate to **Management → Fleet → Agents**
2. Select the agents to upgrade
3. Click **Upgrade** and choose the target version

For standalone agents, perform a manual upgrade:

```bash
# Stop the agent
sudo elastic-agent stop

# Install the new version
# (Follow the same installation steps with the new version)

# Start the agent
sudo elastic-agent start
```

### Uninstalling the Agent

```bash
# For system service installations
sudo elastic-agent uninstall

# For container deployments
docker rm -f elastic-agent
```

## Troubleshooting

### Common Issues

#### Agent Not Connecting to Fleet

- Verify network connectivity to Fleet Server
- Check enrollment token validity
- Ensure proper TLS/SSL configuration

#### Data Not Appearing in Elasticsearch

- Check agent status and logs
- Verify output configuration
- Examine index permissions and ILM policies

#### High Resource Usage

- Review enabled integrations
- Adjust collection intervals
- Consider sampling for high-volume data sources

### Diagnostic Commands

```bash
# Generate diagnostics bundle
sudo elastic-agent diagnostics

# View agent logs
sudo journalctl -u elastic-agent

# Check agent configuration
sudo elastic-agent inspect
```

## Best Practices

### Deployment Strategy

- Use Fleet-managed agents when possible
- Create distinct agent policies for different host types
- Implement role-based access control for Fleet management
- Include the agent in base images or configuration management

### Performance Optimization

- Enable only necessary integrations
- Use appropriate collection intervals based on criticality
- Implement disk queue buffering for reliability
- Size hosts appropriately for expected data volume

### Security Considerations

- Use TLS/SSL for all agent communications
- Implement least-privilege credentials for data access
- Regularly rotate credentials and API keys
- Enable encryption for sensitive agent settings

## Next Steps

- Configure [Custom Integrations](./custom-integrations.md)
- Set up [Agent Monitoring](./agent-monitoring.md)
- Implement [Central Configuration Management](./central-configuration.md)
- Explore [Advanced Deployment Patterns](./advanced-deployments.md)
