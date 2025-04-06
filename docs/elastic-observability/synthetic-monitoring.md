# Synthetic Monitoring

Synthetic monitoring in Elastic Observability provides proactive monitoring of applications and services by simulating user interactions and API calls to ensure availability, performance, and functionality.

## Overview

Synthetic monitoring allows you to:

- Proactively test application functionality before users encounter issues
- Monitor service availability and performance 24/7
- Establish baseline performance metrics
- Track user journeys and critical business workflows
- Alert on failures, performance degradation, or content changes
- Generate consistent monitoring data, even during low-traffic periods

## Key Capabilities

### Lightweight Monitors

Simple checks that verify basic availability and performance:

- **HTTP Monitors**: Validate endpoint availability, status codes, and response times
- **TCP Monitors**: Check port connectivity for databases and other TCP services
- **ICMP Monitors**: Verify network connectivity with ping checks

### Browser Monitors

Advanced checks that simulate user interactions:

- **Page Load**: Monitor full page rendering performance and availability
- **Scripted Journeys**: Test multi-step user workflows like login or checkout
- **Visual Comparisons**: Detect unexpected UI changes
- **Network Insights**: Analyze resource loading, JavaScript errors, and XHR calls

### API Monitors

Validate the functionality and performance of APIs:

- **RESTful API Tests**: Verify endpoints, data structures, and response times
- **SOAP/XML API Tests**: Test complex SOAP services
- **GraphQL Tests**: Validate GraphQL queries and responses
- **Authentication Flows**: Test OAuth, API keys, and other auth methods

## Key Features

### Global Test Locations

Run monitors from multiple geographic locations:

- Multiple public cloud regions across continents
- Private locations within your own infrastructure
- Custom private agents for internal services

### Advanced Scheduling

Flexible scheduling options:

- Run frequency from 1 minute to 24 hours
- Time-of-day specific monitoring
- Business-hours focused testing
- Maintenance window definitions

### Comprehensive Alerting

Robust notification system:

- Alert on availability, performance thresholds, or content changes
- Configure alert severity and frequency
- Integrate with incident management systems
- Define escalation paths

### Detailed Reporting

Rich visualization of monitoring results:

- Historical uptime and performance trends
- SLA compliance reporting
- Performance breakdown by location
- Visual journey step analysis

## Getting Started

### Prerequisites

- Elasticsearch and Kibana deployed
- For browser monitors: Chromium-based synthetic monitoring agents

### Setting Up HTTP Monitors

1. In Kibana, navigate to **Observability → Uptime**
2. Click **Add Monitor**
3. Select **HTTP Monitor**
4. Configure the monitor details:

```yaml
name: 'Website Homepage'
url: 'https://www.example.com'
schedule: '@every 5m'
locations:
  - us-east-1
  - eu-west-1
  - ap-southeast-1
check:
  response:
    status_code: 200
    headers:
      Content-Type: 'text/html'
```

5. Click **Save and Deploy**

### Setting Up Browser Monitors

1. In Kibana, navigate to **Observability → Uptime**
2. Click **Add Monitor**
3. Select **Browser Monitor**
4. Choose **Journey** for multi-step workflows
5. Use the script editor to define your journey:

```javascript
// Login journey example
step('Go to login page', async () => {
  await page.goto('https://example.com/login');
});

step('Fill login form', async () => {
  await page.type('#username', '${ELASTIC_USERNAME}');
  await page.type('#password', '${ELASTIC_PASSWORD}');
});

step('Submit and verify', async () => {
  await page.click('#submit');
  await page.waitForSelector('.welcome-message');
  await expect(page).toMatchElement('.welcome-message', { text: 'Welcome' });
});
```

6. Configure locations, frequency, and alerts
7. Click **Save and Deploy**

## Advanced Configuration

### Environment Variables

Securely manage test credentials and configuration:

1. In Kibana, navigate to **Observability → Uptime → Settings**
2. Add environment variables that can be referenced in your scripts:

```
ELASTIC_USERNAME=test_user
ELASTIC_PASSWORD=******
API_KEY=******
```

### Custom Assertions

Add detailed validations to your monitors:

```javascript
// HTTP monitor content validation
check.response.body.positive: "Welcome to our service"
check.response.body.negative: "Error"

// Browser monitor assertions
await expect(page).toMatchElement('.total', { text: '$49.99' });
await expect(page).toHaveSelector('.cart-items[data-count="3"]');
```

### TLS/SSL Validation

Configure certificate monitoring:

```yaml
check:
  tls:
    certificate_not_valid_after: '7d' # Alert if cert expires in 7 days
    certificate_not_valid_before: true
    verification_mode: full
```

## Integrations

### Alert Integrations

Connect synthetic monitoring alerts to:

- Email notifications
- Slack and Microsoft Teams
- PagerDuty and ServiceNow
- Webhook destinations
- Custom actions

### Data Correlation

Correlate synthetic monitoring data with:

- Real user monitoring (RUM) data
- Application performance metrics (APM)
- Log data
- Infrastructure metrics

## Troubleshooting

Common issues and solutions:

- **Authentication failures**: Check credentials and token expiration
- **Network timeouts**: Verify firewall rules and connectivity
- **Script failures**: Debug browser scripts with screenshots and console logs
- **Resource contention**: Adjust timeouts for resource-intensive pages

## Best Practices

### Effective Monitor Design

- Focus on critical user journeys and business processes
- Balance frequency with resource utilization
- Use variables for environment-specific values
- Implement gradual rollout of new monitors

### Performance Optimization

- Keep browser monitors focused on specific tasks
- Avoid excessive assertions and checks
- Set appropriate timeouts based on expected performance
- Consider reduced frequency for resource-intensive monitors

### Security Considerations

- Use dedicated test accounts with limited privileges
- Store credentials securely as environment variables
- Consider network isolation for private location monitors
- Review access controls to synthetic monitoring data

## Next Steps

- Integrate with [Alerting and Detection](./alerting-detection.md)
- Correlate synthetic data with [Real User Monitoring](./user-experience-monitoring.md)
- Set up [Dashboards](./dashboards.md) for executive visibility
