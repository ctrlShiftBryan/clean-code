# Installing kubectl

This guide provides instructions for installing the Kubernetes command-line tool, kubectl, on various platforms.

## Prerequisites

kubectl version should be within one minor version of your cluster version. For example, a v1.23 client can communicate with v1.22, v1.23, and v1.24 control planes.

## Installation Methods

### macOS

#### Using Homebrew

If you're on macOS and using Homebrew package manager, you can install kubectl with:

```bash
brew install kubectl
```

Or:

```bash
brew install kubernetes-cli
```

#### Using curl

1. Download the latest release:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
```

2. Make the kubectl binary executable:

```bash
chmod +x ./kubectl
```

3. Move the binary to a location in your PATH:

```bash
sudo mv ./kubectl /usr/local/bin/kubectl
```

### Linux

#### Using curl

1. Download the latest release:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

2. Install kubectl:

```bash
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

#### Using native package manager

**Debian-based distributions:**

```bash
sudo apt-get update && sudo apt-get install -y kubectl
```

**Red Hat-based distributions:**

```bash
sudo yum install -y kubectl
```

### Windows

#### Using curl

1. Download the latest release:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/windows/amd64/kubectl.exe"
```

2. Add the binary to your PATH.

#### Using Chocolatey

```bash
choco install kubernetes-cli
```

#### Using Scoop

```bash
scoop install kubectl
```

## Verify Installation

To verify that kubectl is correctly installed, check the version:

```bash
kubectl version --client
```

## Configure kubectl

For kubectl to find and access a Kubernetes cluster, it needs a kubeconfig file. By default, kubectl looks for a file named config in the `$HOME/.kube` directory.

If you're using a managed Kubernetes service, you might need to download or create a kubeconfig file specific to that service.

## Next Steps

Now that you have kubectl installed, you can:

- Learn about [basic kubectl commands](commands.md)
- Explore the [kubectl cheat sheet](cheat-sheet.md)
- Set up [tab completion](tab-completion.md) for kubectl
