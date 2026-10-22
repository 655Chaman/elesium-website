"""
Verhoeff Algorithm Implementation for Indian UIDAI Aadhaar Number Validation.
Mathematical dihedral group D5 checksum computation.
"""

# Multiplication table (dihedral group D5)
_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]

# Permutation table
_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]

# Inverse table
_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]


def compute_checksum(number_str: str) -> int:
    """Computes the Verhoeff check digit for a numeric string."""
    digits = [int(c) for c in reversed(number_str) if c.isdigit()]
    c = 0
    for i, digit in enumerate(digits):
        c = _D[c][_P[(i + 1) % 8][digit]]
    return _INV[c]


def validate_verhoeff(number_str: str) -> bool:
    """Validates whether a numeric string satisfies the Verhoeff algorithm."""
    clean = "".join(c for c in number_str if c.isdigit())
    if not clean:
        return False
    digits = [int(c) for c in reversed(clean)]
    c = 0
    for i, digit in enumerate(digits):
        c = _D[c][_P[i % 8][digit]]
    return c == 0


class AadhaarValidator:
    """
    UIDAI Aadhaar Number Validator.
    Aadhaar numbers must:
    1. Be exactly 12 digits.
    2. Not start with 0 or 1.
    3. Satisfy the Verhoeff D5 dihedral checksum algorithm.
    """

    @staticmethod
    def validate(aadhaar: str) -> bool:
        clean = "".join(c for c in str(aadhaar) if c.isdigit())
        if len(clean) != 12:
            return False
        if clean[0] in ("0", "1"):
            return False
        return validate_verhoeff(clean)

    @staticmethod
    def generate_check_digit(eleven_digit_str: str) -> str:
        """Appends the correct Verhoeff check digit to make a 12-digit Aadhaar."""
        clean = "".join(c for c in eleven_digit_str if c.isdigit())
        if len(clean) != 11:
            raise ValueError("Expected an 11-digit base number")
        check = compute_checksum(clean)
        return f"{clean}{check}"
