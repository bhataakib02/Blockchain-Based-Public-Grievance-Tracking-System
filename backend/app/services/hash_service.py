import hashlib

def compute_sha256_bytes32(content: str) -> str:
    """
    Computes a canonical SHA-256 hash of string content formatted as a 66-character bytes32 string (0x...).
    """
    if not content:
        return "0x0000000000000000000000000000000000000000000000000000000000000000"
    raw_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()
    return f"0x{raw_hash}"

def compute_string_bytes32(text: str) -> str:
    """
    Converts a short string (e.g. department code or title) to a 32-byte left-aligned hex representation.
    """
    if not text:
        return "0x0000000000000000000000000000000000000000000000000000000000000000"
    encoded = text.encode("utf-8")[:32]
    hex_str = encoded.hex().ljust(64, '0')
    return f"0x{hex_str}"
