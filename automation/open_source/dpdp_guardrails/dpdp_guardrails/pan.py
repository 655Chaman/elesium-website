"""
PAN (Permanent Account Number) Validator for Indian Income Tax Department.
Validates structural format, entity status codes, and character distributions.
"""

import re
from typing import Optional, Dict, Any

PAN_REGEX = re.compile(r"^[A-Z]{3}([CPHFATBLJG])[A-Z][0-9]{4}[A-Z]$")

ENTITY_TYPES = {
    "C": "Company",
    "P": "Individual / Person",
    "H": "Hindu Undivided Family (HUF)",
    "F": "Firm / Limited Liability Partnership",
    "A": "Association of Persons (AOP)",
    "T": "Trust",
    "B": "Body of Individuals (BOI)",
    "L": "Local Authority",
    "J": "Artificial Juridical Person",
    "G": "Government Agency"
}


class PANValidator:
    """
    Validates Indian Income Tax PAN card identifiers.
    Rules:
    1. Length: Exactly 10 uppercase characters.
    2. Chars 1-3: Alpha series (AAA to ZZZ).
    3. Char 4: Status identifier (C, P, H, F, A, T, B, L, J, G).
    4. Char 5: Surname initial for individuals or entity name initial.
    5. Chars 6-9: Sequential digits (0001 to 9999).
    6. Char 10: Alphabetic check character.
    """

    @staticmethod
    def validate(pan: str) -> bool:
        if not pan or not isinstance(pan, str):
            return False
        clean = pan.strip().upper()
        if len(clean) != 10:
            return False
        return bool(PAN_REGEX.match(clean))

    @staticmethod
    def inspect(pan: str) -> Optional[Dict[str, Any]]:
        """Parses PAN metadata if valid, else returns None."""
        if not PANValidator.validate(pan):
            return None
        clean = pan.strip().upper()
        status_code = clean[3]
        return {
            "pan": clean,
            "status_code": status_code,
            "entity_type": ENTITY_TYPES.get(status_code, "Unknown"),
            "surname_initial": clean[4],
            "series_number": clean[5:9],
            "check_char": clean[9],
            "is_individual": status_code == "P"
        }
