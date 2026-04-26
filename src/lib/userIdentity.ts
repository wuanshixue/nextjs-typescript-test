export const USER_IDENTITY_VALUES = [
  "UNKNOWN",
  "EXPECTANT_MOTHER",
  "MOTHER",
  "FAMILY",
  "OTHER",
] as const;

export type UserIdentityValue = (typeof USER_IDENTITY_VALUES)[number];

export const USER_IDENTITY_LABELS: Record<UserIdentityValue, string> = {
  UNKNOWN: "未设置身份",
  EXPECTANT_MOTHER: "准妈妈",
  MOTHER: "已育妈妈",
  FAMILY: "家人",
  OTHER: "其他",
};

export const getUserIdentityLabel = (identity?: string | null) => {
  if (!identity || !USER_IDENTITY_VALUES.includes(identity as UserIdentityValue)) {
    return USER_IDENTITY_LABELS.UNKNOWN;
  }

  return USER_IDENTITY_LABELS[identity as UserIdentityValue];
};

export const isExpectantMother = (identity?: string | null) =>
  identity === "EXPECTANT_MOTHER";
