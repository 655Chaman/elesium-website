"""
High-Throughput Sub-10ms PII Masking and Data De-identification Engine
Compliant with Digital Personal Data Protection (DPDP) Act 2023 Section 8(6).
"""

import re
import time
from typing import Dict, Any, List, Tuple
from .verhoeff import AadhaarValidator
from .pan import PANValidator

# Compiled regexes for high-performance scanning
AADHAAR_PATTERN = re.compile(r"\b([2-9][0-9]{3}[\s-]?[0-9]{4}[\s-]?[0-9]{4})\b")
PAN_PATTERN = re.compile(r"\b([A-Z]{5}[0-9]{4}[A-Z])\b", re.IGNORECASE)
PHONE_PATTERN = re.compile(r"(?:\+91[\-\s]?)?[6-9]\d{9}\b")
EMAIL_PATTERN = re.compile(r"\b([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)\b")
IFSC_PATTERN = re.compile(r"\b[A-Z]{4}0[A-Z0-9]{6}\b")
PASSPORT_PATTERN = re.compile(r"\b[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]\b")


class PIIMasker:
    """
    Sub-10ms enterprise PII masking engine for LLM agent pipelines.
    Redacts or anonymizes statutory Indian personal data identifiers before
    prompt dispatch to model inference endpoints.
    """

    def __init__(
        self,
        mask_aadhaar: bool = True,
        mask_pan: bool = True,
        mask_phone: bool = True,
        mask_email: bool = True,
        mask_ifsc: bool = True,
        mask_passport: bool = True,
    ):
        self.mask_aadhaar = mask_aadhaar
        self.mask_pan = mask_pan
        self.mask_phone = mask_phone
        self.mask_email = mask_email
        self.mask_ifsc = mask_ifsc
        self.mask_passport = mask_passport

    def mask_text(self, text: str) -> Tuple[str, Dict[str, Any]]:
        """
        Scans input text and replaces sensitive PII tokens with masked equivalents.
        Returns:
            Tuple of (sanitized_text, audit_telemetry)
        """
        start_time = time.perf_counter()
        findings: List[Dict[str, str]] = []
        result = text

        # 1. Mask Aadhaar numbers (verifying Verhoeff where applicable)
        if self.mask_aadhaar:
            def _aadhaar_repl(match):
                raw = match.group(0)
                clean = re.sub(r"[\s-]", "", raw)
                if len(clean) == 12 and AadhaarValidator.validate(clean):
                    findings.append({"type": "AADHAAR", "original_ending": clean[-4:]})
                    return f"XXXX-XXXX-{clean[-4:]}"
                return raw

            result = AADHAAR_PATTERN.sub(_aadhaar_repl, result)

        # 2. Mask PAN identifiers
        if self.mask_pan:
            def _pan_repl(match):
                raw = match.group(0).upper()
                if PANValidator.validate(raw):
                    findings.append({"type": "PAN", "status_code": raw[3]})
                    return f"{raw[:2]}***{raw[-2:]}"
                return raw

            result = PAN_PATTERN.sub(_pan_repl, result)

        # 3. Mask Phone Numbers
        if self.mask_phone:
            def _phone_repl(match):
                raw = match.group(0)
                digits = re.sub(r"\D", "", raw)
                if len(digits) >= 10:
                    findings.append({"type": "PHONE", "original_ending": digits[-4:]})
                    return f"+91-XXXXX-{digits[-4:]}"
                return raw

            result = PHONE_PATTERN.sub(_phone_repl, result)

        # 4. Mask Email Addresses
        if self.mask_email:
            def _email_repl(match):
                local = match.group(1)
                domain = match.group(2)
                findings.append({"type": "EMAIL", "domain": domain})
                masked_local = local[0] + "***" if len(local) > 1 else "***"
                return f"{masked_local}@{domain}"

            result = EMAIL_PATTERN.sub(_email_repl, result)

        # 5. Mask IFSC
        if self.mask_ifsc:
            def _ifsc_repl(match):
                raw = match.group(0).upper()
                findings.append({"type": "IFSC", "bank_prefix": raw[:4]})
                return f"{raw[:4]}0XXXXXX"

            result = IFSC_PATTERN.sub(_ifsc_repl, result)

        # 6. Mask Passport
        if self.mask_passport:
            def _passport_repl(match):
                raw = match.group(0)
                findings.append({"type": "PASSPORT"})
                return f"{raw[0]}XXXXXXX"

            result = PASSPORT_PATTERN.sub(_passport_repl, result)

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        telemetry = {
            "pii_detected_count": len(findings),
            "findings": findings,
            "latency_ms": round(elapsed_ms, 3),
            "compliant_under": "DPDP Act 2023 Section 8(6)",
            "is_clean": len(findings) == 0,
        }

        return result, telemetry
