export const extractPhoneDigits = (value: string): string => {
  // faqat raqamlarni olib qoladi
  let digits = value.replace(/\D/g, "");

  // agar 998 bilan boshlanmasa qo‘shamiz
  if (!digits.startsWith("998")) {
    digits = "998" + digits;
  }

  return digits.slice(0, 12); // maksimal 12 ta raqam
};

export const formatPhone = (digits: string): string => {
  // 998XXXXXXXXX format → +998 (XX) XXX-XX-XX
  if (!digits) return "+998";

  const cleaned = digits.replace(/^998/, "");

  const part1 = cleaned.slice(0, 2);
  const part2 = cleaned.slice(2, 5);
  const part3 = cleaned.slice(5, 7);
  const part4 = cleaned.slice(7, 9);

  let result = "+998";

  if (part1) result += ` (${part1}`;
  if (part1.length === 2) result += ")";
  if (part2) result += ` ${part2}`;
  if (part3) result += `-${part3}`;
  if (part4) result += `-${part4}`;

  return result;
};