from pathlib import Path


PROMPT_DIR = Path(__file__).resolve().parent.parent / "prompts"


def load_prompt(prompt_name: str) -> str:
    """
    Load a prompt from prompts directory.
    """

    prompt_path = PROMPT_DIR / prompt_name

    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()