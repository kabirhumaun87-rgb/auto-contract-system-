/**
 * Converts numbers into official Bangladeshi Taka currency wording (English script).
 * Adheres to South Asian numbering (Crore, Lakh, Thousand, Hundred, Taka, Paisa).
 * 
 * Example:
 * 125450.00 -> "Taka One Lakh Twenty-Five Thousand Four Hundred Fifty Only"
 * 5000000.00 -> "Taka Fifty Lakh Only"
 * 12345678.50 -> "Taka One Crore Twenty-Three Lakh Forty-Five Thousand Six Hundred Seventy-Eight and Fifty Paisa Only"
 */

const ONES: string[] = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS: string[] = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function twoDigitsToWords(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return one > 0 ? `${TENS[ten]}-${ONES[one]}` : TENS[ten];
}

function threeDigitsToWords(n: number): string {
  let str = '';
  const hundred = Math.floor(n / 100);
  const remainder = n % 100;

  if (hundred > 0) {
    str += `${ONES[hundred]} Hundred`;
    if (remainder > 0) {
      str += ' ';
    }
  }

  if (remainder > 0) {
    str += twoDigitsToWords(remainder);
  }

  return str;
}

/**
 * Converts integer in South Asian format (Crore, Lakh, Thousand, Hundred)
 */
function integerToSouthAsianWords(amount: number): string {
  if (amount === 0) return 'Zero';

  let remaining = Math.floor(amount);
  const parts: string[] = [];

  // Crores (10,000,000)
  const crore = Math.floor(remaining / 10000000);
  if (crore > 0) {
    parts.push(`${integerToSouthAsianWords(crore)} Crore`);
    remaining %= 10000000;
  }

  // Lakhs (100,000)
  const lakh = Math.floor(remaining / 100000);
  if (lakh > 0) {
    parts.push(`${twoDigitsToWords(lakh)} Lakh`);
    remaining %= 100000;
  }

  // Thousands (1,000)
  const thousand = Math.floor(remaining / 1000);
  if (thousand > 0) {
    parts.push(`${twoDigitsToWords(thousand)} Thousand`);
    remaining %= 1000;
  }

  // Hundreds and units
  if (remaining > 0) {
    parts.push(threeDigitsToWords(remaining));
  }

  return parts.join(' ').trim();
}

/**
 * Main function: converts monetary amount to full Bangladeshi Taka words
 */
export function numberToBangladeshiTakaWords(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '';
  }

  if (amount < 0) {
    return `Minus ${numberToBangladeshiTakaWords(Math.abs(amount))}`;
  }

  // Round to 2 decimal places using decimal math approximation
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  const taka = Math.floor(rounded);
  const paisa = Math.round((rounded - taka) * 100);

  const takaWords = integerToSouthAsianWords(taka);

  if (paisa > 0) {
    const paisaWords = twoDigitsToWords(paisa);
    return `Taka ${takaWords} and ${paisaWords} Paisa Only`;
  }

  return `Taka ${takaWords} Only`;
}

/**
 * Formats a numeric amount to Bangladeshi currency format (e.g. 1,23,450.00)
 */
export function formatBangladeshiCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const [intPart, decPart = '00'] = absAmount.toFixed(2).split('.');

  // South Asian formatting: 3 digits from right, then groups of 2
  let result = '';
  const len = intPart.length;

  if (len <= 3) {
    result = intPart;
  } else {
    const lastThree = intPart.slice(len - 3);
    const otherDigits = intPart.slice(0, len - 3);
    const formattedOthers = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${formattedOthers},${lastThree}`;
  }

  return `${isNegative ? '-' : ''}${result}.${decPart}`;
}

/**
 * Checks if a string contains Bengali script characters
 */
export function hasBengaliScript(text?: string | null): boolean {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Translates standard military and civil ranks to Bengali for forwarding letter
 */
export function getBengaliRank(rank?: string | null): string {
  if (!rank) return 'লে. কর্নেল';
  if (hasBengaliScript(rank)) return rank;
  const lower = rank.toLowerCase().trim();
  if (lower.includes('lt col') || lower.includes('lieutenant colonel')) return 'লে. কর্নেল';
  if (lower.includes('col') || lower.includes('colonel')) return 'কর্নেল';
  if (lower.includes('brig') || lower.includes('brigadier')) return 'ব্রিগেডিয়ার জেনারেল';
  if (lower.includes('maj') || lower.includes('major')) return 'মেজর';
  if (lower.includes('capt') || lower.includes('captain')) return 'ক্যাপ্টেন';
  if (lower.includes('executive engineer') || lower === 'ee') return 'নির্বাহী প্রকৌশলী';
  if (lower.includes('assistant engineer') || lower === 'ae') return 'সহকারী প্রকৌশলী';
  if (lower.includes('sub-divisional') || lower.includes('sdo')) return 'উপ-বিভাগীয় প্রকৌশলী';
  if (lower.includes('ge') || lower.includes('garrison engineer')) return 'গ্যারিসন ইঞ্জিনিয়ার';
  return 'লে. কর্নেল';
}

/**
 * Ensures name is rendered in Bengali on Page 2
 */
export function getBengaliSignatoryName(bnName?: string | null, enName?: string | null): string {
  if (bnName && bnName.trim() && hasBengaliScript(bnName)) return bnName.trim();
  if (enName && hasBengaliScript(enName)) return enName.trim();
  if (bnName && bnName.trim()) return bnName.trim();
  if (enName && (enName.toLowerCase().includes('mamun billah') || enName.toLowerCase().includes('abdullah'))) {
    return 'আব্দুল্লাহ আল মামুন বিল্লাহ';
  }
  return bnName || 'আব্দুল্লাহ আল মামুন বিল্লাহ';
}

/**
 * Formats a Bill of Quantities (BOQ) quantity ensuring single-digit numbers have a leading "0".
 * E.g., 1 -> "01", 5 -> "05", 5.00 -> "05.00", 2.252 -> "02.252", 0.45 -> "00.45"
 * Two or more integer digits remain unchanged: 10 -> "10", 42.5 -> "42.5", 185 -> "185"
 *
 * @param quantity The numeric or string quantity value
 * @param decimals Optional number of decimal places (e.g. 2 for general, 3 for Cum)
 */
export function formatBOQQuantity(
  quantity: number | string | null | undefined,
  decimals?: number
): string {
  if (quantity === null || quantity === undefined || quantity === '') {
    return decimals !== undefined && decimals > 0 ? `00.${'0'.repeat(decimals)}` : '00';
  }

  const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  if (isNaN(num)) {
    return String(quantity);
  }

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  let numStr: string;
  if (decimals !== undefined && decimals >= 0) {
    numStr = absNum.toFixed(decimals);
  } else {
    numStr = absNum.toString();
  }

  const parts = numStr.split('.');
  const intPart = parts[0] || '0';
  const decPart = parts.length > 1 ? `.${parts[1]}` : '';

  // If the integer part is a single digit (0-9), prepend '0'
  const paddedInt = intPart.length === 1 ? `0${intPart}` : intPart;

  return `${isNegative ? '-' : ''}${paddedInt}${decPart}`;
}

