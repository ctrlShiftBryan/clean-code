# kubectl Command Reference

This document provides a comprehensive reference for kubectl commands organized by operation type.

## Basic Commands

### create

Create a resource from a file or stdin.

```bash
kubectl create -f FILENAME
```

Common resource types:

- `configmap`: Create a ConfigMap from a local file, directory, or literal value
- `deployment`: Create a deployment with the specified name
- `namespace`: Create a namespace with the specified name
- `secret`: Create a secret from a local file, directory, or literal value
- `service`: Create a service using a specified subcommand

### get

Display one or many resources.

```bash
kubectl get [(-o|--output=)json|yaml|wide|custom-columns=...|custom-columns-file=...|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=...] (TYPE[.VERSION][.GROUP] [NAME | -l label] | TYPE[.VERSION][.GROUP]/NAME ...) [flags]
```

### describe

Show details of a specific resource or group of resources.

```bash
kubectl describe (-f FILENAME | TYPE [NAME_PREFIX | -l label] | TYPE/NAME)
```

### delete

Delete resources by file names, stdin, resources and names, or by resources and label selector.

```bash
kubectl delete ([-f FILENAME] | TYPE [(NAME | -l label | --all)])
```

### edit

Edit a resource on the server.

```bash
kubectl edit (RESOURCE/NAME | -f FILENAME)
```

## Deployment Commands

### rollout

Manage the rollout of a resource.

```bash
kubectl rollout SUBCOMMAND
```

Subcommands:

- `history`: View rollout history
- `pause`: Mark the provided resource as paused
- `restart`: Restart a resource
- `resume`: Resume a paused resource
- `status`: Show the status of the rollout
- `undo`: Undo a previous rollout

### scale

Set a new size for a deployment, replica set, or replication controller.

```bash
kubectl scale [--resource-version=version] [--current-replicas=count] --replicas=COUNT (-f FILENAME | TYPE NAME)
```

### autoscale

Auto-scale a deployment, replica set, or replication controller.

```bash
kubectl autoscale (-f FILENAME | TYPE NAME | TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU]
```

## Cluster Management Commands

### cluster-info

Display cluster information.

```bash
kubectl cluster-info [flags]
```

### top

Display resource (CPU/memory) usage.

```bash
kubectl top [flags] [options]
```

Subcommands:

- `node`: Display resource usage of nodes
- `pod`: Display resource usage of pods

### cordon

Mark node as unschedulable.

```bash
kubectl cordon NODE
```

### uncordon

Mark node as schedulable.

```bash
kubectl uncordon NODE
```

### drain

Drain node in preparation for maintenance.

```bash
kubectl drain NODE
```

### taint

Update the taints on one or more nodes.

```bash
kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1
```

## Troubleshooting and Debugging Commands

### describe

Show details of a specific resource or group of resources.

```bash
kubectl describe (-f FILENAME | TYPE [NAME_PREFIX | -l label] | TYPE/NAME)
```

### logs

Print the logs for a container in a pod.

```bash
kubectl logs [-f] [-p] POD [-c CONTAINER]
```

### exec

Execute a command in a container.

```bash
kubectl exec POD [-c CONTAINER] -- COMMAND [args...]
```

### port-forward

Forward one or more local ports to a pod.

```bash
kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N]
```

### proxy

Run a proxy to the Kubernetes API server.

```bash
kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix]
```

### cp

Copy files and directories to and from containers.

```bash
kubectl cp <file-spec-src> <file-spec-dest>
```

### auth

Inspect authorization.

```bash
kubectl auth SUBCOMMAND
```

Subcommands:

- `can-i`: Check whether an action is allowed
- `reconcile`: Reconciles RBAC role, rolebinding, clusterrole, and clusterrolebinding objects

## Advanced Commands

### apply

Apply a configuration to a resource by file name or stdin.

```bash
kubectl apply (-f FILENAME | -k DIRECTORY)
```

### patch

Update fields of a resource using strategic merge patch, a JSON merge patch, or a JSON patch.

```bash
kubectl patch (-f FILENAME | TYPE NAME) -p PATCH
```

### replace

Replace a resource by file name or stdin.

```bash
kubectl replace -f FILENAME
```

### wait

Wait for a specific condition on one or many resources.

```bash
kubectl wait ([-f FILENAME] | resource.group/resource.name | resource.group [(-l label | --all)]) [--for=delete|--for condition=available]
```

### kustomize

Build a kustomization target from a directory or URL.

```bash
kubectl kustomize DIRECTORY
```

## Settings Commands

### label

Update the labels on a resource.

```bash
kubectl label [--overwrite] (-f FILENAME | TYPE NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version]
```

### annotate

Update the annotations on a resource.

```bash
kubectl annotate [--overwrite] (-f FILENAME | TYPE NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version]
```

### completion

Output shell completion code for the specified shell (bash, zsh, fish, or powershell).

```bash
kubectl completion SHELL
```

## Other Commands

### api-resources

Print the supported API resources on the server.

```bash
kubectl api-resources
```

### api-versions

Print the supported API versions on the server, in the form of "group/version".

```bash
kubectl api-versions
```

### config

Modify kubeconfig files.

```bash
kubectl config SUBCOMMAND
```

Subcommands:

- `current-context`: Display the current-context
- `delete-cluster`: Delete the specified cluster from kubeconfig
- `delete-context`: Delete the specified context from kubeconfig
- `get-clusters`: Display clusters defined in kubeconfig
- `get-contexts`: Describe one or many contexts
- `rename-context`: Rename a context from the kubeconfig file
- `set`: Set an individual value in a kubeconfig file
- `set-cluster`: Set a cluster entry in kubeconfig
- `set-context`: Set a context entry in kubeconfig
- `set-credentials`: Set a user entry in kubeconfig
- `unset`: Unset an individual value in a kubeconfig file
- `use-context`: Set the current-context in a kubeconfig file
- `view`: Display merged kubeconfig settings or a specified kubeconfig file

### plugin

Provides utilities for interacting with plugins.

```bash
kubectl plugin [flags] [options]
```

### version

Print the client and server version information.

```bash
kubectl version
```

## Tips and Tricks

- Use the `--help` flag to get more information about a specific command.
- Use the `--v` flag to increase the verbosity of logs.
- Use `kubectl explain <resource>` to get documentation of a resource.
- Use `kubectl explain <resource>.<fieldName>[.<fieldName>]` to get documentation of specific fields.

## Next Steps

- Learn about [kubectl context and configuration](contexts.md)
- Explore the [kubectl cheat sheet](cheat-sheet.md)
- See [advanced usage](advanced-usage.md) examples
