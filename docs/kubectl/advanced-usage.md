# Advanced kubectl Usage

This document covers advanced techniques and usage patterns for kubectl that can help you be more productive when working with Kubernetes clusters.

## Output Formatting and Filtering

### JSONPath and Custom Columns

```bash
# Get specific fields using JSONPath
kubectl get pods -o jsonpath='{.items[*].metadata.name}'

# Format output with custom columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName

# Sort output
kubectl get pods --sort-by=.metadata.creationTimestamp

# Filter with JSONPath
kubectl get pods -o jsonpath='{.items[?(@.status.phase=="Running")].metadata.name}'
```

### Using Go Templates

```bash
# List pod names using a Go template
kubectl get pods -o go-template='{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}'

# Complex transformations
kubectl get pods -o go-template='{{range .items}}{{if eq .status.phase "Running"}}{{.metadata.name}}{{"\n"}}{{end}}{{end}}'
```

## Resource Selection and Filtering

### Label and Field Selectors

```bash
# Filter by label
kubectl get pods -l app=nginx,tier=frontend

# Filter by multiple label values
kubectl get pods -l 'environment in (production,staging)'

# Filter by field
kubectl get pods --field-selector=status.phase=Running

# Combined selectors
kubectl get pods --field-selector=status.phase=Running -l app=nginx
```

### Resource Types and Names

```bash
# Get multiple resource types
kubectl get pods,services,deployments

# Get resources by name
kubectl get pod/nginx-1234 service/nginx

# Get resources with specific prefix
kubectl get pods -l app=nginx --no-headers | grep "frontend" | awk '{print $1}'
```

## Bulk Operations

### Applying Changes to Multiple Files

```bash
# Apply all yaml files in a directory
kubectl apply -f ./configs/

# Recursively apply from a directory
kubectl apply -f ./configs/ --recursive

# Apply with Kustomize
kubectl apply -k ./overlays/production/
```

### Bulk Deletions

```bash
# Delete resources matching a selector
kubectl delete pods,services -l app=nginx

# Delete all pods but keep the deployments
kubectl delete pods --all

# Force delete stuck resources
kubectl delete pod stuck-pod --grace-period=0 --force
```

## Patching Resources

### Strategic, JSON, and Merge Patches

```bash
# Strategic merge patch (default)
kubectl patch deployment nginx-deployment -p '{"spec":{"replicas":3}}'

# JSON Merge Patch
kubectl patch deployment nginx-deployment --type=merge -p '{"spec":{"replicas":4}}'

# JSON Patch
kubectl patch deployment nginx-deployment --type=json -p='[{"op":"replace","path":"/spec/replicas","value":5}]'
```

### Updating Specific Fields

```bash
# Update container image
kubectl patch deployment nginx-deployment --type=json -p='[{"op":"replace","path":"/spec/template/spec/containers/0/image","value":"nginx:1.19"}]'

# Add a label
kubectl patch deployment nginx-deployment -p '{"metadata":{"labels":{"newlabel":"value"}}}'
```

## Resource Management

### Wait for Conditions

```bash
# Wait for a deployment to complete
kubectl wait --for=condition=available deployment/nginx-deployment --timeout=60s

# Wait for pods to be ready
kubectl wait --for=condition=ready pods --all --timeout=120s

# Wait for a job to complete
kubectl wait --for=condition=complete job/data-processor
```

### Watch Resource Changes

```bash
# Watch pod changes
kubectl get pods --watch

# Watch with custom formatting
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase --watch
```

## Working with Resource Specs

### Validating and Diffing

```bash
# Validate resource without applying
kubectl apply -f deployment.yaml --dry-run=client

# Server-side validation
kubectl apply -f deployment.yaml --dry-run=server

# View differences before applying
kubectl diff -f deployment.yaml
```

### Editing Resources

```bash
# Edit resources in your preferred editor
kubectl edit deployment/nginx-deployment

# Edit a specific resource using JSONPath
kubectl get deployment nginx-deployment -o json | jq '.spec.template.spec.containers[0].resources.limits.cpu = "500m"' | kubectl replace -f -
```

## Debugging and Troubleshooting

### Container Inspection

```bash
# Get container status
kubectl get pods -o jsonpath='{.items[*].status.containerStatuses[*].name}{"\t"}{.items[*].status.containerStatuses[*].ready}'

# Get container restart count
kubectl get pods -o jsonpath='{.items[*].status.containerStatuses[*].restartCount}'

# Get container environment variables
kubectl exec pod-name -- env
```

### Debugging with Ephemeral Containers

```bash
# Create a debugging container in a running pod (Kubernetes 1.18+)
kubectl debug -it pod/mypod --image=busybox --target=container-name
```

### Network Debugging

```bash
# Test service connectivity
kubectl run -it --rm debug --image=busybox -- wget -O- http://my-service:8080

# Debug DNS issues
kubectl run -it --rm debug --image=busybox -- nslookup kubernetes.default

# Port forwarding to multiple ports
kubectl port-forward pod/mypod 8080:80 8443:443
```

## Scripting and Automation

### Shell Scripts

```bash
# Get all pod names and store in a variable
PODS=$(kubectl get pods -o jsonpath='{.items[*].metadata.name}')

# Loop through pods
for POD in $PODS; do
  kubectl exec $POD -- some-command
done

# Get resource limits
kubectl get nodes -o jsonpath='{.items[*].status.allocatable.cpu}'
```

### Resource Generation

```bash
# Generate a deployment YAML without creating it
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml > deployment.yaml

# Generate a service YAML
kubectl create service clusterip nginx --tcp=80:80 --dry-run=client -o yaml > service.yaml
```

## Performance Optimization

### Server-Side Processing

```bash
# Server-side filtering
kubectl get pods --server-side=true --field-selector=metadata.namespace=default

# Server-side apply (Kubernetes 1.18+)
kubectl apply --server-side -f deployment.yaml
```

### Resource Quotas and Limits

```bash
# View resource quotas
kubectl get resourcequotas

# Check pod resource usage
kubectl top pods

# Check node resource usage
kubectl top nodes
```

## Plugins and Extensions

### Krew Plugin Manager

```bash
# Install krew
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)

# Add krew to your path
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

# Install plugins
kubectl krew install ctx
kubectl krew install ns
kubectl krew install neat
```

### Useful Plugins

```bash
# Switch contexts easily
kubectl ctx

# Switch namespaces
kubectl ns

# Clean up YAML output
kubectl neat get pod mypod -o yaml

# View pod resource usage
kubectl resource-capacity

# View audit logs
kubectl who-can get pods
```

## Next Steps

- Learn about [kubectl for operators](kubectl-for-operators.md)
- Explore [service mesh integration](service-mesh.md)
- See [CI/CD practices](ci-cd.md)
