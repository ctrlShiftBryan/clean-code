# kubectl Tab Completion

This document explains how to set up tab completion for kubectl in various shells to improve productivity when working with Kubernetes.

## Overview

Tab completion allows you to quickly autocomplete kubectl commands, resource types, resource names, and flags by pressing the Tab key. This can significantly speed up your workflow and reduce typing errors.

## Bash

### Temporary Setup

To set up kubectl tab completion for your current bash session:

```bash
source <(kubectl completion bash)
```

### Permanent Setup

To make kubectl tab completion permanent for all bash sessions:

1. First, ensure the bash-completion package is installed:

   **For Ubuntu/Debian:**

   ```bash
   sudo apt-get install bash-completion
   ```

   **For macOS:**

   ```bash
   brew install bash-completion
   ```

2. Add kubectl completion to your bash profile:

   ```bash
   echo 'source <(kubectl completion bash)' >>~/.bashrc
   ```

3. If you use kubectl as an alias (e.g., `alias k=kubectl`), extend the completion to the alias:

   ```bash
   echo 'alias k=kubectl' >>~/.bashrc
   echo 'complete -F __start_kubectl k' >>~/.bashrc
   ```

4. Apply the changes:

   ```bash
   source ~/.bashrc
   ```

## Zsh

### Temporary Setup

To set up kubectl tab completion for your current zsh session:

```zsh
source <(kubectl completion zsh)
```

### Permanent Setup

To make kubectl tab completion permanent for all zsh sessions:

1. Create a completion directory if it doesn't exist:

   ```zsh
   mkdir -p ~/.zsh/completion
   ```

2. Add kubectl completion to your zsh profile:

   ```zsh
   echo 'if type "kubectl" > /dev/null; then source <(kubectl completion zsh); fi' >>~/.zshrc
   ```

3. If you use kubectl as an alias:

   ```zsh
   echo 'alias k=kubectl' >>~/.zshrc
   echo 'compdef __start_kubectl k' >>~/.zshrc
   ```

4. Apply the changes:

   ```zsh
   source ~/.zshrc
   ```

### Oh-My-Zsh Setup

If you're using Oh-My-Zsh:

1. Enable the kubectl plugin by editing your `~/.zshrc`:

   ```zsh
   plugins=(... kubectl)
   ```

2. This plugin automatically sets up completion and several useful aliases.

## Fish

### Temporary Setup

To set up kubectl tab completion for your current fish session:

```fish
kubectl completion fish | source
```

### Permanent Setup

To make kubectl tab completion permanent for all fish sessions:

```fish
kubectl completion fish > ~/.config/fish/completions/kubectl.fish
```

Make sure the directory exists first:

```fish
mkdir -p ~/.config/fish/completions
```

## PowerShell

### Temporary Setup

To set up kubectl tab completion for your current PowerShell session:

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

### Permanent Setup

To make kubectl tab completion permanent for all PowerShell sessions, add it to your PowerShell profile:

1. Check if you have a PowerShell profile:

   ```powershell
   Test-Path $PROFILE
   ```

2. If it returns `False`, create a profile:

   ```powershell
   New-Item -Type File -Path $PROFILE -Force
   ```

3. Add the completion to your profile:

   ```powershell
   "kubectl completion powershell | Out-String | Invoke-Expression" | Add-Content $PROFILE
   ```

4. If you use an alias:

   ```powershell
   "Set-Alias -Name k -Value kubectl" | Add-Content $PROFILE
   "Register-ArgumentCompleter -CommandName k -ScriptBlock $__kubectlCompleterBlock" | Add-Content $PROFILE
   ```

## Verification

To verify that tab completion is working correctly, type a partial kubectl command and press Tab. For example:

```bash
kubectl g<TAB>
```

This should complete to:

```bash
kubectl get
```

Then you can continue typing or press Tab again to see available options.

## Troubleshooting

### Completion Not Working

1. **Make sure kubectl is installed correctly:**

   ```bash
   kubectl version --client
   ```

2. **Check that your shell completion is working for other commands:**

   ```bash
   # For bash/zsh
   type -t complete  # Should output "builtin"
   ```

3. **For Bash, ensure bash-completion is installed and sourced:**

   ```bash
   # Check if bash-completion is installed
   pkg-config --exists bash-completion && echo "Bash completion is installed" || echo "Bash completion is not installed"

   # Check if sourced
   grep -q 'bash_completion' ~/.bashrc && echo "Bash completion is sourced" || echo "Bash completion is not sourced"
   ```

### Common Issues

1. **Command not found errors:** Ensure the path to kubectl is in your $PATH.

2. **Slow completion:** If tab completion is slow, consider using a proxy or using client-side completion only.

3. **"complete: command not found":** This usually means bash-completion is not installed or sourced.

## Tips and Tricks

1. **Using aliases effectively:**

   ```bash
   # Common kubectl aliases
   alias k='kubectl'
   alias kg='kubectl get'
   alias kgp='kubectl get pods'
   alias kgd='kubectl get deployments'
   alias kgs='kubectl get services'
   ```

2. **Context and namespace switching with completion:**

   ```bash
   # For bash
   kubectl config use-context <TAB>
   kubectl config set-context --current --namespace=<TAB>

   # For zsh with kubectl plugin
   kctx <TAB>
   kns <TAB>
   ```

3. **Combine with kubectl plugins for even better productivity:**

   ```bash
   # Install krew plugin manager
   kubectl krew install ctx
   kubectl krew install ns

   # Then use with completion
   kubectl ctx <TAB>
   kubectl ns <TAB>
   ```

## Next Steps

- Learn about [kubectl aliases](aliases.md)
- Explore the [kubectl cheat sheet](cheat-sheet.md)
- See [advanced scripting with kubectl](scripting.md)
