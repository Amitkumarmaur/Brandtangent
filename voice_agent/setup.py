"""
setup.py -- One-click setup script for the DigiiMark Voice AI Agent.

Run this ONCE after cloning / downloading:
    python setup.py

What it does:
  1. Checks your Python version (3.10+ required)
  2. Creates a virtual environment (venv/)
  3. Installs all dependencies from requirements.txt
  4. Copies .env.example → .env if .env doesn't exist
  5. Runs a quick connectivity test (Gemini API ping)
  6. Prints confirmation with next steps
"""

from __future__ import annotations

import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent.resolve()
VENV = HERE / "venv"
ENV_FILE = HERE / ".env"
ENV_EXAMPLE = HERE / ".env.example"
REQUIREMENTS = HERE / "requirements.txt"

# Force UTF-8 output on Windows to avoid cp1252 encode errors
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ── ANSI colours ──────────────────────────────────────────────────────────────
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def ok(msg):   print(f"  {GREEN}[OK]{RESET}  {msg}")
def warn(msg): print(f"  {YELLOW}[!]{RESET}   {msg}")
def err(msg):  print(f"  {RED}[ERR]{RESET} {msg}"); sys.exit(1)
def info(msg): print(f"  {CYAN}-->{RESET}  {msg}")
def header(t): print(f"\n{BOLD}{t}{RESET}")


def check_python() -> None:
    header("Step 1 -- Checking Python version")
    v = sys.version_info
    info(f"Detected Python {v.major}.{v.minor}.{v.micro}")
    if v < (3, 10):
        err(f"Python 3.10+ is required. You have {v.major}.{v.minor}.")
    ok("Python version OK")


def create_venv() -> Path:
    header("Step 2 -- Creating virtual environment")
    if VENV.exists():
        warn("venv/ already exists -- skipping creation.")
    else:
        subprocess.check_call([sys.executable, "-m", "venv", str(VENV)])
        ok("Virtual environment created at venv/")

    # Determine the python/pip inside the venv
    is_win = platform.system() == "Windows"
    python = VENV / ("Scripts" if is_win else "bin") / ("python.exe" if is_win else "python")
    return python


def install_deps(venv_python: Path) -> None:
    header("Step 3 -- Installing dependencies")
    info("This may take 1-3 minutes on first run...")
    subprocess.check_call([
        str(venv_python), "-m", "pip", "install",
        "--quiet", "--upgrade", "pip",
    ])
    subprocess.check_call([
        str(venv_python), "-m", "pip", "install",
        "--quiet", "-r", str(REQUIREMENTS),
    ])
    ok("All dependencies installed")


def copy_env() -> None:
    header("Step 4 -- Environment configuration")
    if ENV_FILE.exists():
        warn(".env already exists -- not overwriting.")
        info("Make sure GEMINI_API_KEY is set in your .env file.")
    else:
        shutil.copy(ENV_EXAMPLE, ENV_FILE)
        ok(".env created from .env.example")
        print()
        print(f"  {YELLOW}{BOLD}ACTION REQUIRED:{RESET}")
        print(f"  Open {BOLD}voice_agent/.env{RESET} and set:")
        print(f"    {CYAN}GEMINI_API_KEY{RESET} = key from https://aistudio.google.com/apikey")
        print(f"    {CYAN}SUPABASE_URL{RESET} + {CYAN}SUPABASE_SERVICE_ROLE_KEY{RESET} = Supabase project API settings")
        print(f"    {CYAN}CALCOM_API_KEY{RESET} + {CYAN}CALCOM_EVENT_TYPE_ID{RESET} = Cal.com (booking)")


def test_gemini(venv_python: Path) -> None:
    header("Step 5 -- Testing Gemini API connection")

    # Parse .env manually (dotenv may not be installed in the base Python yet)
    api_key = ""
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("GEMINI_API_KEY="):
                api_key = line.split("=", 1)[1].strip()
                break

    if not api_key or api_key == "your_gemini_api_key_here":
        warn("GEMINI_API_KEY not set -- skipping connectivity test.")
        warn("Set the key in .env and run: python main.py after activating venv.")
        return

    test_script = """
import sys, os
sys.path.insert(0, r'{here}')
os.environ.setdefault('GEMINI_API_KEY', r'{key}')
try:
    import google.genai as genai
    client = genai.Client(api_key=r'{key}')
    resp = client.models.generate_content(
        model='gemini-2.0-flash',
        contents='Say HELLO in one word.'
    )
    print('PING_OK')
except Exception as e:
    print(f'PING_FAIL: {{e}}')
""".format(here=str(HERE), key=api_key)

    result = subprocess.run(
        [str(venv_python), "-c", test_script],
        capture_output=True, text=True
    )
    output = (result.stdout + result.stderr).strip()

    if "PING_OK" in output:
        ok("Gemini API connection successful!")
    else:
        warn(f"Gemini API test failed: {output}")
        warn("Check your GEMINI_API_KEY in .env")


def print_next_steps() -> None:
    is_win = platform.system() == "Windows"
    activate = (
        r"venv\Scripts\activate" if is_win
        else "source venv/bin/activate"
    )
    sep = "-" * 55

    print(f"\n{sep}")
    print(f"{BOLD}{GREEN}  [DONE] Setup complete!{RESET}")
    print(sep)
    print()
    print(f"  {BOLD}Next steps:{RESET}")
    print()
    print(f"  1. Edit {CYAN}.env{RESET} -- add your GEMINI_API_KEY")
    print(f"  2. Activate the venv:")
    print(f"       {BOLD}{activate}{RESET}")
    print()
    print(f"  3. Run the agent:")
    print(f"       {BOLD}python main.py{RESET}")
    print()
    print(f"  4. Useful commands:")
    print(f"       {BOLD}python main.py --list-devices{RESET}   # List audio devices")
    print(f"       {BOLD}python main.py --sync-kb{RESET}        # Re-sync knowledge base from Supabase")
    print(f"       {BOLD}python main.py --list-calls{RESET}     # View recent call history")
    print()
    print(f"  5. Run the SQL migration in Supabase first:")
    print(f"       {CYAN}scripts/voice-agent-supabase-migration.sql{RESET}")
    print(f"     Then run {BOLD}python scripts/sync_voice_kb.py{RESET} to populate the knowledge base.")
    print()
    print(f"{sep}\n")


def main() -> None:
    print(f"\n{BOLD}{CYAN}DigiiMark Voice AI Agent -- Setup{RESET}")
    print("-" * 55)

    check_python()
    venv_python = create_venv()
    install_deps(venv_python)
    copy_env()
    test_gemini(venv_python)
    print_next_steps()


if __name__ == "__main__":
    main()
