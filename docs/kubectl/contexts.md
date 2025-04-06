# kubectl Contexts and Configuration

This document provides information about managing kubectl contexts and configuration to work with multiple Kubernetes clusters.

## Overview

kubectl uses a configuration file called `kubeconfig` to store information about clusters, users, namespaces, and authentication mechanisms. By default, kubectl looks for a file named `config` in the `$HOME/.kube` directory.

With contexts, you can:

- Switch between multiple clusters
- Switch between different namespaces within a cluster
- Switch between different user identities

## The kubeconfig File

A kubeconfig file has three main sections:

1. **Clusters**: Information about the Kubernetes clusters you have access to
2. **Users**: User credentials for authentication to those clusters
3. **Contexts**: Combinations of clusters, users, and namespaces

Example kubeconfig file structure:

```yaml
apiVersion: v1
kind: Config
preferences: {}
current-context: dev-frontend

clusters:
  - name: development
    cluster:
      server: https://1.2.3.4:6443
      certificate-authority: /path/to/ca.crt
  - name: production
    cluster:
      server: https://5.6.7.8:6443
      certificate-authority-data: BASE64_ENCODED_CA_CONTENTS

users:
  - name: developer
    user:
      client-certificate: /path/to/client.crt
      client-key: /path/to/client.key
  - name: admin
    user:
      token: BEARER_TOKEN

contexts:
  - name: dev-frontend
    context:
      cluster: development
      user: developer
      namespace: frontend
  - name: dev-backend
    context:
      cluster: development
      user: developer
      namespace: backend
  - name: prod-admin
    context:
      cluster: production
      user: admin
      namespace: default
```

## Managing Contexts

### Viewing Configuration

```bash
# View the entire kubeconfig
kubectl config view

# View a specific kubeconfig file
kubectl config view --kubeconfig=/path/to/config

# Suppress sensitive information
kubectl config view --minify

# Get the current context
kubectl config current-context
```

### Creating and Modifying Configuration

```bash
# Set a cluster entry
kubectl config set-cluster development --server=https://1.2.3.4:6443 --certificate-authority=/path/to/ca.crt

# Set user credentials
kubectl config set-credentials developer --client-certificate=/path/to/client.crt --client-key=/path/to/client.key

# Create a context
kubectl config set-context dev-frontend --cluster=development --user=developer --namespace=frontend

# Modify a context to use a different namespace
kubectl config set-context dev-frontend --namespace=new-namespace
```

### Working with Contexts

```bash
# List all available contexts
kubectl config get-contexts

# Switch to a different context
kubectl config use-context prod-admin

# Change the namespace in the current context
kubectl config set-context --current --namespace=another-namespace

# Delete a context
kubectl config delete-context dev-backend

# Rename a context
kubectl config rename-context old-name new-name
```

## Environment Variables

You can also use environment variables to override or supplement kubeconfig settings:

- `KUBECONFIG`: Specifies the path to a kubeconfig file
- `KUBE_CONFIG_PATH`: Alternative to KUBECONFIG
- `KUBE_CONTEXT`: Sets the context to use
- `KUBE_CLUSTER`: Sets the cluster to use
- `KUBE_USER`: Sets the user to use
- `KUBE_NAMESPACE`: Sets the namespace to use

Example:

```bash
export KUBECONFIG=/path/to/custom/config
export KUBE_NAMESPACE=testing
kubectl get pods # Will use the custom config and the testing namespace
```

## Merging Multiple kubeconfig Files

You can merge multiple kubeconfig files by setting the `KUBECONFIG` environment variable with paths to multiple files:

```bash
export KUBECONFIG=~/.kube/config:~/.kube/production:~/.kube/staging
```

When you use kubectl with this setup, it will merge all specified kubeconfig files.

## Best Practices

1. **Use namespaces effectively**: Create contexts with different namespaces to avoid accidentally operating on the wrong resources.

2. **Name contexts clearly**: Use descriptive names that indicate the cluster, environment, and purpose.

3. **Secure your kubeconfig file**: Protect your kubeconfig file since it contains sensitive authentication information.

4. **Use multiple kubeconfig files**: For production environments, consider using separate kubeconfig files.

5. **Regularly update credentials**: Rotate certificates and tokens as needed.

## Practical Examples

### Working with Multiple Clusters

```bash
# Add a new cluster
kubectl config set-cluster staging --server=https://staging-api.example.com

# Add user credentials for this cluster
kubectl config set-credentials staging-admin --token=TOKEN

# Create a context that ties them together
kubectl config set-context staging --cluster=staging --user=staging-admin --namespace=default

# Switch to this context
kubectl config use-context staging
```

### Creating a Context from an Existing kubeconfig File

```bash
# Merge an externally provided kubeconfig
KUBECONFIG=~/.kube/config:/path/to/new-cluster-config kubectl config view --flatten > ~/.kube/merged-config
mv ~/.kube/merged-config ~/.kube/config
```

## Troubleshooting

1. **Invalid configuration**: If you see errors about invalid configuration, check the syntax of your kubeconfig file.

2. **Authentication issues**: Ensure certificates, keys, and tokens are valid and not expired.

3. **Permission errors**: Make sure your kubeconfig file has appropriate permissions (600 or more restrictive).

4. **Context not found**: Verify the context name with `kubectl config get-contexts`.

## Next Steps

- Learn about [role-based access control (RBAC)](rbac.md)
- Explore [cluster administration](cluster-admin.md)
- See [authentication mechanisms](authentication.md)
