from app.core.prompt_loader import load_prompt


def test_load_prompt():
    prompt = load_prompt("master_prompt.md")
    assert prompt is not None
    assert "{idea}" in prompt
    assert "{context}" in prompt
    assert "system_architecture" in prompt
