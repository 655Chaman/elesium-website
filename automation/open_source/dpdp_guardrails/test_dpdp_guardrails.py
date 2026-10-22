"""
Unit test suite for dpdp_guardrails package.
"""

import unittest
from dpdp_guardrails import AadhaarValidator, PANValidator, PIIMasker, dpdp_guardrail, compute_checksum


class TestDPDPGuardrails(unittest.TestCase):

    def test_verhoeff_checksum(self):
        # 11-digit base
        base = "36759834601"
        check_digit = compute_checksum(base)
        full_aadhaar = f"{base}{check_digit}"
        self.assertTrue(AadhaarValidator.validate(full_aadhaar))

    def test_aadhaar_validation(self):
        # Test valid Aadhaar (with correct check digit)
        valid = AadhaarValidator.generate_check_digit("54321987654")
        self.assertTrue(AadhaarValidator.validate(valid))

        # Test invalid length
        self.assertFalse(AadhaarValidator.validate("12345"))
        # Test leading 0 or 1
        self.assertFalse(AadhaarValidator.validate("012345678901"))
        self.assertFalse(AadhaarValidator.validate("112345678901"))
        # Test invalid checksum
        self.assertFalse(AadhaarValidator.validate(valid[:-1] + ("0" if valid[-1] != "0" else "1")))

    def test_pan_validation(self):
        # Valid individual PAN
        self.assertTrue(PANValidator.validate("ABCPK1234D"))
        # Valid company PAN
        self.assertTrue(PANValidator.validate("XYZCA5678E"))
        # Invalid PAN (numbers in wrong position)
        self.assertFalse(PANValidator.validate("AB1234567D"))
        # Invalid entity character
        self.assertFalse(PANValidator.validate("ABCZK1234D"))

        # Test inspection
        info = PANValidator.inspect("ABCPK1234D")
        self.assertIsNotNone(info)
        self.assertEqual(info["entity_type"], "Individual / Person")
        self.assertEqual(info["surname_initial"], "K")
        self.assertTrue(info["is_individual"])

    def test_pii_masking_latency_and_accuracy(self):
        masker = PIIMasker()
        valid_aadhaar = AadhaarValidator.generate_check_digit("23456789012")

        sample_text = (
            f"Customer verification memo: Citizen with Aadhaar {valid_aadhaar} and "
            f"PAN ABCPK1234D requested account opening. Contact mobile +919876543210 "
            f"and email test.user@enterprise.org. IFSC code HDFC0001234."
        )

        masked_text, telemetry = masker.mask_text(sample_text)

        # Assert all identifiers are masked
        self.assertNotIn(valid_aadhaar, masked_text)
        self.assertIn("XXXX-XXXX-", masked_text)
        self.assertNotIn("ABCPK1234D", masked_text)
        self.assertIn("AB***4D", masked_text)
        self.assertNotIn("+919876543210", masked_text)
        self.assertIn("+91-XXXXX-3210", masked_text)
        self.assertNotIn("test.user@enterprise.org", masked_text)
        self.assertIn("t***@enterprise.org", masked_text)
        self.assertNotIn("HDFC0001234", masked_text)
        self.assertIn("HDFC0XXXXXX", masked_text)

        # Assert sub-10ms performance
        self.assertLess(telemetry["latency_ms"], 10.0)
        self.assertGreaterEqual(telemetry["pii_detected_count"], 5)

    def test_convenience_helper(self):
        text = "Contact support at +919876543210."
        masked, tele = dpdp_guardrail(text)
        self.assertIn("+91-XXXXX-3210", masked)


if __name__ == "__main__":
    unittest.main()
