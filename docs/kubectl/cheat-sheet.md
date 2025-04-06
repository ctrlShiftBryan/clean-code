# kubectl Cheat Sheet

A quick reference for common kubectl commands and operations.

## Cluster Management

```bash
# Display cluster information
kubectl cluster-info

# Display the Kubernetes version
kubectl version

# Get all nodes in the cluster
kubectl get nodes

# Get detailed information about a specific node
kubectl describe node <node-name>

# Mark node as unschedulable
kubectl cordon <node-name>

# Mark node as schedulable
kubectl uncordon <node-name>

# Drain node in preparation for maintenance
kubectl drain <node-name>

# Show metrics for nodes
kubectl top node
```

## Resource Management

### Pods

```bash
# List all pods
kubectl get pods

# List pods with more details
kubectl get pods -o wide

# List pods in all namespaces
kubectl get pods --all-namespaces

# Get pod logs
kubectl logs <pod-name>

# Stream pod logs with timestamps
kubectl logs -f <pod-name> --timestamps

# Execute command in pod container
kubectl exec -it <pod-name> -- /bin/bash

# Get pod details
kubectl describe pod <pod-name>

# Get pod metrics
kubectl top pod
```

### Deployments

```bash
# List all deployments
kubectl get deployments

# Create deployment
kubectl create deployment <name> --image=<image>

# Scale deployment
kubectl scale deployment <name> --replicas=<count>

# Update deployment image
kubectl set image deployment/<name> <container>=<image>:<tag>

# Rollback deployment
kubectl rollout undo deployment/<name>

# Pause deployment
kubectl rollout pause deployment/<name>

# Resume deployment
kubectl rollout resume deployment/<name>

# Deployment status
kubectl rollout status deployment/<name>

# Deployment history
kubectl rollout history deployment/<name>
```

### Services

```bash
# List all services
kubectl get services

# Expose deployment as service
kubectl expose deployment <name> --port=<port> --target-port=<target-port>

# Get detailed information about a specific service
kubectl describe service <service-name>
```

### ConfigMaps and Secrets

```bash
# Create ConfigMap
kubectl create configmap <name> --from-file=<path> --from-literal=<key>=<value>

# Get ConfigMaps
kubectl get configmaps

# Create Secret
kubectl create secret generic <name> --from-file=<path> --from-literal=<key>=<value>

# Get Secrets
kubectl get secrets
```

## Troubleshooting

```bash
# Port forwarding
kubectl port-forward <pod-name> <local-port>:<pod-port>

# Proxy to Kubernetes API
kubectl proxy

# Get events
kubectl get events

# Get events sorted by timestamp
kubectl get events --sort-by=.metadata.creationTimestamp
```

## Configuration

```bash
# View kubectl configuration
kubectl config view

# Get current context
kubectl config current-context

# List available contexts
kubectl config get-contexts

# Switch context
kubectl config use-context <context-name>

# Set namespace preference
kubectl config set-context --current --namespace=<namespace>
```

## Resource Types and Explanations

```bash
# Get API resources
kubectl api-resources

# Explain resource
kubectl explain <resource>

# Explain specific field of a resource
kubectl explain <resource>.<fieldName>
```

## Output Formatting

```bash
# Output in JSON format
kubectl get <resource> -o json

# Output in YAML format
kubectl get <resource> -o yaml

# Custom columns
kubectl get <resource> -o custom-columns=<column1>:<jsonpath1>,<column2>:<jsonpath2>

# Jsonpath
kubectl get <resource> -o jsonpath='{.items[0].metadata.name}'

# Go template
kubectl get <resource> -o go-template='{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}'
```

## Applying/Editing Resources

```bash
# Apply resource
kubectl apply -f <file-or-directory>

# Apply resources in a directory
kubectl apply -f <directory>

# Edit resource
kubectl edit <resource> <resource-name>

# Delete resource
kubectl delete -f <file>

# Delete resource
kubectl delete <resource> <resource-name>
```

## Namespaces

```bash
# List namespaces
kubectl get namespaces

# Create namespace
kubectl create namespace <name>

# Set current namespace
kubectl config set-context --current --namespace=<namespace>

# List resources in a specific namespace
kubectl get <resource> -n <namespace>
```

## Labels and Annotations

```bash
# Add label
kubectl label <resource> <resource-name> <key>=<value>

# Remove label
kubectl label <resource> <resource-name> <key>-

# Filter by label
kubectl get <resource> -l <key>=<value>

# Add annotation
kubectl annotate <resource> <resource-name> <key>=<value>
```

## Quick Tips

- Use `kubectl help <command>` for help about any command
- Use `--v=<level>` to set the log level verbosity
- Use `-o wide` for additional information
- Use `--all-namespaces` or `-A` to view resources across all namespaces
- Use `--watch` or `-w` to watch for changes
- Use `kubectl diff -f <file>` to view differences before applying changes
