# Overview of kubectl

`kubectl` is a command line interface for running commands against Kubernetes clusters. This overview covers `kubectl` syntax, describes the command operations, and provides common examples.

## What is kubectl?

kubectl is the Kubernetes command-line tool that allows you to run commands against Kubernetes clusters. You can use kubectl to deploy applications, inspect and manage cluster resources, and view logs.

## Installation

For installation instructions, please see the [installation guide](installation.md).

## Syntax

Use the following syntax to run `kubectl` commands from your terminal window:

```
kubectl [command] [TYPE] [NAME] [flags]
```

where `command`, `TYPE`, `NAME`, and `flags` are:

- `command`: Specifies the operation that you want to perform on one or more resources, for example `create`, `get`, `describe`, `delete`.
- `TYPE`: Specifies the resource type. Resource types are case-sensitive and you can specify the singular, plural, or abbreviated forms. For example, the following commands produce the same output:
  ```
  $ kubectl get pod pod1
  $ kubectl get pods pod1
  $ kubectl get po pod1
  ```
- `NAME`: Specifies the name of the resource. Names are case-sensitive. If the name is omitted, details for all resources are displayed, for example `$ kubectl get pods`.

- `flags`: Specifies optional flags. For example, you can use the `-s` or `--server` flags to specify the address and port of the Kubernetes API server.

## Getting Help

If you need help, just run `kubectl help` from the terminal window.

## Common Operations

For common operations, see the [common operations guide](common-operations.md).

## Configuration

kubectl looks for a file named `config` in the `$HOME/.kube` directory. You can specify other kubeconfig files by setting the `KUBECONFIG` environment variable or by setting the `--kubeconfig` flag.

## Next Steps

- Learn about [kubectl commands](commands.md)
- Explore the [kubectl cheat sheet](cheat-sheet.md)
- See [advanced usage](advanced-usage.md) for more complex operations
