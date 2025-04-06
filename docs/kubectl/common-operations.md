# Common kubectl Operations

This guide covers the most common operations you'll perform with kubectl when working with Kubernetes clusters.

## Creating Resources

Use `kubectl create` to create resources from a file or stdin.

```bash
# Create a deployment using a file
kubectl create -f deployment.yaml

# Create a service using a file
kubectl create -f service.yaml

# Create multiple resources defined in a directory
kubectl create -f <directory>/

# Create a deployment imperatively
kubectl create deployment nginx --image=nginx
```

## Getting Information About Resources

Use `kubectl get` to list one or more resources.

```bash
# List all pods in the current namespace
kubectl get pods

# List all pods with more details
kubectl get pods -o wide

# List pods in all namespaces
kubectl get pods --all-namespaces

# List pods with custom columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase

# List pods in JSON format
kubectl get pods -o json

# List pods in YAML format
kubectl get pods -o yaml

# List multiple resource types
kubectl get pods,services,deployments

# List resources by label selector
kubectl get pods -l app=nginx
```

## Describing Resources

Use `kubectl describe` to get detailed information about a resource.

```bash
# Describe a specific pod
kubectl describe pod <pod-name>

# Describe all pods
kubectl describe pods

# Describe a specific node
kubectl describe node <node-name>

# Describe pods matching a label selector
kubectl describe pods -l app=nginx
```

## Deleting Resources

Use `kubectl delete` to delete resources.

```bash
# Delete a pod
kubectl delete pod <pod-name>

# Delete a deployment
kubectl delete deployment <deployment-name>

# Delete resources using a file
kubectl delete -f deployment.yaml

# Delete resources using a label selector
kubectl delete pods,services -l app=nginx

# Delete all pods (but not the deployments that manage them)
kubectl delete pods --all
```

## Executing Commands in Containers

Use `kubectl exec` to run commands in a container.

```bash
# Run a command in a pod
kubectl exec <pod-name> -- ls /

# Run a command in a specific container of a multi-container pod
kubectl exec <pod-name> -c <container-name> -- ls /

# Get an interactive shell
kubectl exec -it <pod-name> -- /bin/bash
```

## Viewing Logs

Use `kubectl logs` to view container logs.

```bash
# View logs for a pod
kubectl logs <pod-name>

# View logs for a specific container in a multi-container pod
kubectl logs <pod-name> -c <container-name>

# Stream logs for a pod
kubectl logs -f <pod-name>

# View logs for a pod with a timestamp
kubectl logs <pod-name> --timestamps

# View logs for a pod over the last hour
kubectl logs <pod-name> --since=1h
```

## Scaling Resources

Use `kubectl scale` to change the number of replicas.

```bash
# Scale a deployment to 5 replicas
kubectl scale deployment <deployment-name> --replicas=5

# Scale multiple deployments
kubectl scale deployment <deployment-1> <deployment-2> --replicas=3
```

## Port Forwarding

Use `kubectl port-forward` to forward ports from a pod to your local machine.

```bash
# Forward a port from a pod to your local machine
kubectl port-forward <pod-name> 8080:80

# Forward multiple ports
kubectl port-forward <pod-name> 8080:80 8443:443
```

## Applying Configuration Changes

Use `kubectl apply` to apply configuration changes to resources.

```bash
# Apply changes to a resource
kubectl apply -f deployment.yaml

# Apply changes to multiple resources
kubectl apply -f <directory>/

# Apply changes with record flag (records the command in the resource annotation)
kubectl apply -f deployment.yaml --record
```

## Editing Resources

Use `kubectl edit` to edit resources in your default editor.

```bash
# Edit a deployment
kubectl edit deployment <deployment-name>

# Edit a service
kubectl edit service <service-name>
```

## Copying Files

Use `kubectl cp` to copy files between your local filesystem and a container.

```bash
# Copy file from local to pod
kubectl cp /local/path <pod-name>:/container/path

# Copy file from pod to local
kubectl cp <pod-name>:/container/path /local/path

# Copy from a specific container in a pod
kubectl cp /local/path <pod-name>:/container/path -c <container-name>
```

## Next Steps

- Learn about [advanced operations](advanced-usage.md)
- Explore the [kubectl cheat sheet](cheat-sheet.md)
- See the full [command reference](commands.md)
