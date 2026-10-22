"""
Bangladeshi Taka Amount-to-Words Converter for Auto Contract System
Standard MES and GOB Public Procurement Format.
"""

from decimal import Decimal, ROUND_HALF_UP

ONES = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
]

TENS = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
]

def two_digits_to_words(n: int) -> str:
    if n == 0:
        return ""
    if n < 20:
        return ONES[n]
    ten = n // 10
    one = n % 10
    return f"{TENS[ten]}-{ONES[one]}" if one > 0 else TENS[ten]

def three_digits_to_words(n: int) -> str:
    parts = []
    hundred = n // 100
    rem = n % 100
    if hundred > 0:
        parts.append(f"{ONES[hundred]} Hundred")
    if rem > 0:
        parts.append(two_digits_to_words(rem))
    return " ".join(parts)

def integer_to_south_asian_words(amount: int) -> str:
    if amount == 0:
        return "Zero"

    parts = []
    # Crores (10,000,000)
    crore = amount // 10000000
    if crore > 0:
        parts.append(f"{integer_to_south_asian_words(crore)} Crore")
        amount %= 10000000

    # Lakhs (100,000)
    lakh = amount // 100000
    if lakh > 0:
        parts.append(f"{two_digits_to_words(lakh)} Lakh")
        amount %= 100000

    # Thousands (1,000)
    thousand = amount // 1000
    if thousand > 0:
        parts.append(f"{two_digits_to_words(thousand)} Thousand")
        amount %= 1000

    # Hundreds and units
    if amount > 0:
        parts.append(three_digits_to_words(amount))

    return " ".join(parts).strip()

def number_to_bangladeshi_taka_words(amount_val) -> str:
    if amount_val is None:
        return ""
    try:
        d = Decimal(str(amount_val)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    except Exception:
        return ""

    if d < 0:
        return f"Minus {number_to_bangladeshi_taka_words(abs(d))}"

    taka = int(d)
    paisa = int((d - Decimal(taka)) * 100)

    taka_words = integer_to_south_asian_words(taka)

    if paisa > 0:
        paisa_words = two_digits_to_words(paisa)
        return f"Taka {taka_words} and {paisa_words} Paisa Only"

    return f"Taka {taka_words} Only"
