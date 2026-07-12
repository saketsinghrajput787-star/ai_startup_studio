import re


def clean_json_response(text: str) -> str:
    """
    Remove markdown code block wraps and retrieve clean JSON string.
    """

    cleaned = text.strip()

    if cleaned.startswith("```"):

        match = re.search(
            r"```(?:json)?\s*(.*?)\s*```",
            cleaned,
            re.DOTALL
        )

        if match:

            cleaned = match.group(1).strip()

    return cleaned
