# User Experience Monitoring

User Experience Monitoring in Elastic Observability provides real-time visibility into how users interact with your web applications, capturing performance metrics, errors, and user journeys.

## Overview

Elastic Real User Monitoring (RUM) enables you to:

- Track actual user experiences across browsers and devices
- Measure real-world performance metrics
- Identify client-side errors and exceptions
- Analyze user behavior and interaction patterns
- Correlate frontend performance with backend services
- Understand geographic and device-specific performance variations

## Key Features

### Core Web Vitals Monitoring

Track Google's Core Web Vitals and other key performance metrics:

- **Largest Contentful Paint (LCP)**: Measures loading performance
- **First Input Delay (FID)**: Measures interactivity
- **Cumulative Layout Shift (CLS)**: Measures visual stability
- **First Contentful Paint (FCP)**: Time to first content rendering
- **Time to First Byte (TTFB)**: Initial server response time
- **Total Blocking Time (TBT)**: Main thread blocking duration

### Frontend Error Tracking

Comprehensive client-side error detection:

- JavaScript exceptions
- Network request failures
- Resource loading errors
- Custom error events
- Error grouping and deduplication
- Stack trace analysis

### User Journey Tracking

Monitor how users navigate through your application:

- Page views and navigations
- User clicks and interactions
- Form submissions
- Custom user actions
- Session recording (optional)
- Conversion funnel analysis

### Performance Analysis

Detailed performance breakdowns:

- Page load waterfall charts
- Resource timing analysis
- JavaScript execution timing
- Browser rendering metrics
- Network request performance
- JavaScript framework metrics (React, Angular, Vue)

### User Context

Rich contextual information for each session:

- Browser type and version
- Device type and capabilities
- Operating system details
- Geographic location
- Connection type
- User identifiers (configurable)

## Implementation

### Basic Setup

#### 1. Add the RUM Agent to Your Application

Add the RUM JavaScript library to your web application:

**Using NPM (recommended):**

```bash
npm install @elastic/apm-rum
```

Then initialize it in your application:

```javascript
import { init as initApm } from '@elastic/apm-rum';

const apm = initApm({
  serviceName: 'my-frontend-app',
  serverUrl: 'https://your-apm-server-url:8200',
  environment: 'production',
});
```

**Using Script Tag:**

```html
<script src="https://unpkg.com/@elastic/apm-rum@5.12.0/dist/bundles/elastic-apm-rum.umd.min.js"></script>
<script>
  elasticApm.init({
    serviceName: 'my-frontend-app',
    serverUrl: 'https://your-apm-server-url:8200',
    environment: 'production',
  });
</script>
```

#### 2. Configure Data Collection Options

Customize the RUM agent's behavior:

```javascript
import { init as initApm } from '@elastic/apm-rum';

const apm = initApm({
  serviceName: 'my-frontend-app',
  serverUrl: 'https://your-apm-server-url:8200',
  environment: 'production',

  // Performance monitoring settings
  breakdownMetrics: true,
  pageLoadTraceId: true,
  pageLoadSampling: 1.0,

  // Error tracking settings
  captureErrors: true,
  errorThrottleLimit: 20,
  errorThrottleInterval: 30000,

  // Distributed tracing
  distributedTracing: true,
  distributedTracingOrigins: ['https://api.example.com'],

  // Privacy settings
  centralConfig: true,
  disableInstrumentations: [],
});
```

### Advanced Configuration

#### Custom Transactions

Track specific user flows with custom transactions:

```javascript
// Start a custom transaction
const transaction = apm.startTransaction('checkout-flow', 'user-journey');

// Perform some operations...
// For example, a multi-step checkout process

// Add custom data
transaction.addLabels({
  cartValue: 99.99,
  itemCount: 3,
  promoCode: 'SUMMER2023',
});

// End the transaction when complete
transaction.end();
```

#### Custom Spans

Measure performance of specific operations within transactions:

```javascript
// Create a custom span within a transaction
const span = transaction.startSpan('product-search', 'app');

// Perform the operation you want to measure
const results = await searchProducts(query);

// Add details about the operation
span.addLabels({
  resultsCount: results.length,
  searchTerm: query,
});

// End the span when the operation completes
span.end();
```

#### User Identification

Associate monitoring data with specific users (respecting privacy):

```javascript
// Set the current user context
apm.setUserContext({
  id: 'user-123', // Unique identifier (non-PII)
  username: 'masked-user', // Consider privacy implications
  email: 'masked@example.com', // Consider privacy implications
  role: 'premium-subscriber',
});
```

#### Custom Context

Add application-specific context to all RUM data:

```javascript
// Add custom context that will be attached to all transactions
apm.addLabels({
  deploymentVersion: 'v2.3.1',
  experimentGroup: 'test-group-B',
  featureFlags: 'new-checkout-enabled',
});
```

## Analyzing User Experience Data

### Kibana RUM Dashboard

Explore real user data in Kibana:

1. Navigate to **Observability → User Experience**
2. View the overview dashboard for high-level metrics
3. Drill down into specific pages, browsers, or geographic regions
4. Analyze performance trends over time
5. Correlate frontend performance with backend services

### Performance Analysis

Understand performance bottlenecks:

1. Identify slow pages or user journeys
2. Analyze performance by device type, browser, or location
3. View waterfall charts of resource loading
4. Track impact of new deployments on performance
5. Create custom visualizations for specific metrics

### Error Investigation

Troubleshoot client-side errors:

1. View error frequency and impact
2. Group similar errors together
3. Analyze stack traces and error context
4. Correlate errors with specific browser versions or user actions
5. Track error rates over time and across releases

## Best Practices

### Performance Optimization

- Monitor Core Web Vitals across your user base
- Set performance budgets and alerts
- Implement performance fixes based on real user data
- A/B test performance improvements
- Focus on the slowest percentiles (p95, p99)

### Privacy Compliance

- Configure data anonymization for PII
- Implement appropriate consent mechanisms
- Review personal data collection
- Respect do-not-track settings
- Establish appropriate data retention policies

### Sampling Strategy

Balance data volume with coverage:

- Use higher sampling rates for critical paths
- Consider lower sampling for high-traffic pages
- Adjust sampling based on application importance
- Implement smart sampling based on error conditions
- Use distributed tracing sampling aligned with backend

### Deployment Considerations

- Implement versioning to track performance across releases
- Use source maps for accurate error stack traces
- Consider CDN implications for RUM agent loading
- Test RUM instrumentation in staging environments
- Monitor RUM agent's own performance impact

## Troubleshooting

Common issues and solutions:

- **Missing data**: Check agent installation and network connectivity
- **Inconsistent metrics**: Verify consistent agent versions across applications
- **High overhead**: Adjust sampling rates or disable costly features
- **Privacy issues**: Review and adjust user identification settings

## Next Steps

- Correlate RUM data with [backend services](./application-monitoring.md)
- Set up [alerts](./alerting-detection.md) for performance degradation
- Compare real user data with [synthetic monitoring](./synthetic-monitoring.md)
- Implement [custom dashboards](./dashboards.md) for executive reporting
