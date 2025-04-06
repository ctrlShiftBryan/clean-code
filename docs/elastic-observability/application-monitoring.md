# Application Performance Monitoring (APM)

Application Performance Monitoring in Elastic Observability provides deep visibility into your applications' behavior, performance, and health, enabling faster debugging and optimization.

## Overview

Elastic APM automatically instruments your applications to collect detailed performance data, including:

- Request/transaction traces
- Distributed tracing across service boundaries
- Code-level performance metrics
- Database query performance
- Error tracking and exceptions
- Service dependencies and maps

## Supported Technologies

Elastic APM supports a wide range of languages and frameworks:

| Language   | Supported Frameworks                   |
| ---------- | -------------------------------------- |
| Java       | Spring, Jakarta EE, Micronaut, Quarkus |
| .NET       | ASP.NET Core, Entity Framework         |
| Node.js    | Express, Fastify, NestJS, Next.js      |
| Python     | Django, Flask, FastAPI                 |
| Ruby       | Rails, Sinatra                         |
| Go         | Gin, Echo, Gorilla                     |
| PHP        | Laravel, Symfony                       |
| JavaScript | React, Angular, Vue.js                 |

## Key Features

### Transaction Monitoring

Track the performance of individual transactions:

- End-to-end latency metrics
- Transaction breakdowns
- Request/response details
- Context propagation

### Service Maps

Visualize your application architecture:

- Service dependencies
- Communication patterns
- Latency between services
- Error rates between components

### Distributed Tracing

Follow requests across service boundaries:

- Complete trace visualization
- Span details and timing
- Cross-service dependencies
- Root cause identification

### Code-Level Visibility

Identify performance bottlenecks in your code:

- Stack traces
- Method-level timing
- Memory allocation
- CPU utilization

### Error Tracking

Comprehensive error monitoring:

- Exception details
- Error frequency and trends
- Contextual information
- Related log messages

## Getting Started

### Installation

#### 1. Configure Elastic APM Server

If you're using Elastic Cloud, APM Server is already included. For self-managed:

1. Install Elastic APM Server:

```bash
curl -L -O https://artifacts.elastic.co/downloads/apm-server/apm-server-8.10.0-darwin-x86_64.tar.gz
tar xzvf apm-server-8.10.0-darwin-x86_64.tar.gz
cd apm-server-8.10.0-darwin-x86_64
```

2. Configure APM Server in `apm-server.yml`:

```yaml
apm-server:
  host: '0.0.0.0:8200'

output.elasticsearch:
  hosts: ['localhost:9200']
  username: 'elastic'
  password: 'changeme'
```

3. Start APM Server:

```bash
./apm-server -e
```

#### 2. Instrument Your Application

**For Java:**

Add the agent JAR and configuration:

```bash
java -javaagent:/path/to/elastic-apm-agent-1.38.0.jar \
     -Delastic.apm.service_name=my-application \
     -Delastic.apm.server_url=http://localhost:8200 \
     -jar my-application.jar
```

**For Node.js:**

```javascript
// Add to the top of your main file
const apm = require('elastic-apm-node').start({
  serviceName: 'my-application',
  serverUrl: 'http://localhost:8200',
});
```

**For Python:**

```python
# Add to the top of your main file
from elasticapm.contrib.flask import ElasticAPM

app = Flask(__name__)
app.config['ELASTIC_APM'] = {
  'SERVICE_NAME': 'my-application',
  'SERVER_URL': 'http://localhost:8200'
}
apm = ElasticAPM(app)
```

### Viewing APM Data

1. Open Kibana and navigate to **Observability → APM**
2. Select your service from the Services overview
3. Explore transactions, errors, and service maps

## Advanced Configuration

### Custom Instrumentation

Add custom spans to track specific code blocks:

**Java:**

```java
import co.elastic.apm.api.ElasticApm;
import co.elastic.apm.api.Span;

Span span = ElasticApm.currentTransaction().startSpan();
try {
    span.setName("custom operation");
    // Your code here
} finally {
    span.end();
}
```

**Node.js:**

```javascript
const span = apm.startSpan('custom operation');
// Your code here
span.end();
```

### Filtering Sensitive Data

Configure the agent to redact sensitive information:

**Java:**

```
elastic.apm.transaction_ignore_urls=*/health,*/metrics
elastic.apm.sanitize_field_names=password,secret,token
```

**Node.js:**

```javascript
{
  filterHttpHeaders: ['authorization', 'cookie'],
  sanitizeFieldNames: ['password', 'secret', 'token']
}
```

## Troubleshooting

Common issues and solutions:

- **Missing data**: Ensure proper agent configuration and connectivity to APM Server
- **High cardinality**: Configure transaction naming to reduce cardinality
- **Performance impact**: Adjust sampling rate for high-traffic applications

## Next Steps

- Integrate with [Log Analytics](./log-analytics.md) for full-context debugging
- Set up [Alerts](./alerting-detection.md) for application performance
- Explore [User Experience Monitoring](./user-experience-monitoring.md) for front-end visibility
