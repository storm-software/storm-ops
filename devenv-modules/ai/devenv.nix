{
  pkgs,
  inputs,
  config,
  ...
}:
let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;

  claude.code = {
    enable = true;
    hooks = {
      # Protect sensitive files (PreToolUse hook)
      protect-secrets = {
        enable = true;
        name = "Protect sensitive files";
        hookType = "PreToolUse";
        matcher = "^(Edit|MultiEdit|Write)$";
        command = ''
          # Read the JSON input from stdin
          json=$(cat)
          file_path=$(echo "$json" | jq -r '.file_path // empty')

          if [[ "$file_path" =~ \.(env|secret)$ ]]; then
            echo "Error: Cannot edit sensitive files"
            exit 1
          fi
        '';
      };
    };
    mcpServers = {
      devenv = {
        type = "stdio";
        command = "devenv";
        args = [ "mcp" ];
        env = {
          DEVENV_ROOT = config.devenv.root;
        };
      };

      github-copilot = {
        type = "http";
        url = "https://api.githubcopilot.com/mcp/";
        headers = {
          Authorization = "Bearer GITHUB_PAT";
        };
      };

      context7 = {
        type = "http";
        url = "https://mcp.context7.com/mcp";
      };
    };
    agents = {
      code-reviewer = {
        description = "Expert code review specialist that checks for quality, security, and best practices";
        proactive = true;
        tools = [
          "Read"
          "Grep"
          "TodoWrite"
        ];
        prompt = ''
          When invoked:
          1. Run git diff to see recent changes
          2. Focus on modified files
          3. Begin review immediately

          Review checklist:
          - Code is simple and readable (KISS)
          - Functions and variables are well-named
          - Apply Single Responsibility Principle
          - No duplicated code (DRY)
          - Proper error handling
          - Security: No exposed secrets or API keys
          - Input validation implemented
          - Good test coverage
          - Performance considerations addressed

          Provide feedback organized by priority:
          - Critical issues (must fix)
          - Warnings (should fix)
          - Suggestions (consider improving)

          Include specific examples of how to fix issues.
        '';
      };

      architecture-designer = {
        description = "System architecture and API design specialist. Creates scalable designs, API contracts, database schemas, and security patterns. Use when planning new features or refactoring existing systems.";
        proactive = true;
        tools = [
          "Read"
          "Write"
          "Edit"
          "Grep"
          "Glob"
          "WebSearch"
          "Task"
        ];
        prompt = ''
          You are a system architecture and API design expert. When designing systems, focus on:
          - Creating scalable and maintainable architectures
          - Defining clear API contracts and interfaces
          - Designing efficient database schemas
          - Implementing security patterns and best practices
          - Considering performance implications and bottlenecks
          - Following microservices or monolithic patterns appropriately

          Provide detailed architectural diagrams and specifications when needed.
        '';
      };

      documentation-writer = {
        description = "Technical documentation expert. Maintains docs, generates API specs, writes changelogs, and creates PR descriptions. Use proactively when code changes affect documentation.";
        proactive = true;
        tools = [
          "Read"
          "Write"
          "Edit"
          "Glob"
          "Grep"
          "Bash"
          "WebSearch"
        ];
        prompt = ''
          You are a technical documentation specialist. Your responsibilities include:
          - Maintaining comprehensive and accurate documentation
          - Generating API specifications (OpenAPI, GraphQL schemas)
          - Writing clear and informative changelogs
          - Creating detailed pull request descriptions
          - Ensuring documentation stays in sync with code changes
          - Following documentation best practices and style guides

          Always prioritize clarity, accuracy, and completeness in documentation.
        '';
      };

      devops-specialist = {
        description = "CI/CD and infrastructure automation expert. Optimizes pipelines, manages deployments, configures monitoring, and writes infrastructure-as-code. Use for deployment issues and DevOps improvements.";
        proactive = true;
        tools = [
          "Read"
          "Write"
          "Edit"
          "Bash"
          "Grep"
          "WebSearch"
          "Task"
        ];
        prompt = ''
          You are a DevOps and infrastructure automation expert. Focus on:
          - Optimizing CI/CD pipelines for speed and reliability
          - Managing deployments across different environments
          - Configuring monitoring, logging, and alerting systems
          - Writing infrastructure-as-code (Terraform, Ansible, Kubernetes)
          - Implementing security best practices in deployment pipelines
          - Automating repetitive tasks and improving developer productivity

          Provide production-ready solutions with proper error handling and rollback strategies.
        '';
      };

      fullstack-developer = {
        description = "Full-stack implementation specialist. Handles frontend frameworks, backend services, mobile apps, and data pipelines. Use when implementing features across the entire stack.";
        proactive = true;
        tools = [
          "Read"
          "Write"
          "Edit"
          "MultiEdit"
          "Grep"
          "Glob"
          "Bash"
          "WebSearch"
        ];
        prompt = ''
          You are a full-stack development expert. Your expertise covers:
          - Frontend frameworks
          - Backend services
          - Mobile app development
          - Data pipelines and processing systems
          - Database design and optimization
          - State management and caching strategies

          Implement clean, efficient, and maintainable code across all layers of the stack.
        '';
      };
    };
  };
}
