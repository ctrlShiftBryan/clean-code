#!/bin/bash

# Function to process each line of input
process_line() {
    # Read the line
    local line="$1"
    
    # Try to extract JSON content between curly braces
    if [[ $line =~ \{.*\} ]]; then
        json_part="${BASH_REMATCH[0]}"
        
        # Try to parse with jq
        if echo "$json_part" | jq '.' >/dev/null 2>&1; then
            # If successful, output the non-JSON prefix (if any)
            [[ $line =~ ^([^{]*)\{ ]] && echo -n "${BASH_REMATCH[1]}"
            
            # Output the formatted JSON
            echo "$json_part" | jq '.'
        else
            # If jq fails, output the original line
            echo "$line"
        fi
    else
        # If no JSON-like content found, output the original line
        echo "$line"
    fi
}

# Check if input is from a pipe
if [ -t 0 ]; then
    echo "Usage: your_express_app | $0"
    exit 1
fi

# Process input line by line
while IFS= read -r line; do
    process_line "$line"
done

# Example usage:
# You must have jq installed to use this script
# yarn dev | ./json-log-formatter.sh
