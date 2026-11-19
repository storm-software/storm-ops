#!/usr/bin/env python3
"""Exercise the module's hook command through sh, as Claude settings may do."""

import json
import os
from pathlib import Path
import shutil
import subprocess
import unittest


class ProtectSecretsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.shell = os.environ.get("HOOK_TEST_SHELL", "sh")
        if settings := os.environ.get("HOOK_TEST_SETTINGS"):
            hooks = json.loads(Path(settings).read_text())["hooks"]["PreToolUse"]
            cls.command = next(
                hook["hooks"][0]["command"] for hook in hooks
                if hook.get("matcher") == "^(Edit|MultiEdit|Write)$"
            )
            return

        module = Path(__file__).resolve().parents[1] / "devenv.nix"
        jq_package = Path(shutil.which("jq")).resolve().parents[1]
        # Nix lazily evaluates only the hook, without activating a workspace or
        # downloading an entire devenv environment for these command tests.
        expression = f"""
          let module = import {module} {{
            config = {{}};
            lib = {{}};
            pkgs.jq = {json.dumps(str(jq_package))};
          }};
          in module.config.claude.code.hooks.protect-secrets.command
        """
        cls.command = json.loads(subprocess.check_output(
            ["nix-instantiate", "--eval", "--strict", "--json", "--expr", expression],
            text=True,
        ))

    def run_hook(self, payload):
        return subprocess.run(
            [self.shell, "-c", self.command], input=payload,
            text=True, capture_output=True,
        )

    def payload(self, path, tool="Write", **extra):
        return json.dumps({
            "hook_event_name": "PreToolUse",
            "tool_name": tool,
            "tool_input": {"file_path": path, **extra},
        })

    def test_allows_normal_files_without_diagnostics(self):
        for tool in ("Write", "Edit", "MultiEdit"):
            for path in ("/workspace/src/app.ts", "/workspace/my files/readme.md", "/workspace/.env.local"):
                with self.subTest(tool=tool, path=path):
                    result = self.run_hook(self.payload(path, tool))
                    self.assertEqual((result.returncode, result.stdout, result.stderr), (0, "", ""))

    def test_preserves_json_escapes_in_write_content(self):
        result = self.run_hook(self.payload(
            "/workspace/src/app.ts",
            content='first\nsecond\t"quoted"\\backslash\n' + r"\u0000",
        ))
        self.assertEqual((result.returncode, result.stdout, result.stderr), (0, "", ""))

    def test_blocks_sensitive_files_with_claude_blocking_exit_code(self):
        for tool in ("Write", "Edit", "MultiEdit"):
            for path in ("/workspace/.env", "/workspace/production.env", "/workspace/my files/key.secret"):
                with self.subTest(tool=tool, path=path):
                    result = self.run_hook(self.payload(path, tool))
                    self.assertEqual(result.returncode, 2)
                    self.assertEqual(result.stdout, "")
                    self.assertIn("Cannot edit sensitive files", result.stderr)

    def test_preserves_json_escapes_in_edit_content(self):
        for tool in ("Edit", "MultiEdit"):
            edit = {"old_string": "first\nsecond\t", "new_string": r"literal\n"}
            content = {"edits": [edit]} if tool == "MultiEdit" else edit
            with self.subTest(tool=tool):
                result = self.run_hook(self.payload("/workspace/src/app.ts", tool, **content))
                self.assertEqual((result.returncode, result.stdout, result.stderr), (0, "", ""))

    def test_allows_missing_file_path(self):
        result = self.run_hook('{"tool_input": {}}')
        self.assertEqual((result.returncode, result.stdout, result.stderr), (0, "", ""))

    def test_blocks_malformed_json_with_a_diagnostic(self):
        result = self.run_hook('{"tool_input":')
        self.assertEqual(result.returncode, 2)
        self.assertEqual(result.stdout, "")
        self.assertIn("Cannot parse Claude hook input", result.stderr)


if __name__ == "__main__":
    unittest.main()
