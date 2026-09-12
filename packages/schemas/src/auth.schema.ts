import { z } from "zod";

function getUtf8ByteLength(value: string) {
  let byteLength = 0;

  for (let index = 0; index < value.length; index++) {
    const codePoint = value.charCodeAt(index);

    if (
      codePoint >= 0xd800 &&
      codePoint <= 0xdbff
    ) {
      const nextCodePoint =
        index + 1 < value.length
          ? value.charCodeAt(index + 1)
          : 0;

      if (
        nextCodePoint >= 0xdc00 &&
        nextCodePoint <= 0xdfff
      ) {
        byteLength += 4;
        index++;
      } else {
        byteLength += 3;
      }
    } else if (
      codePoint >= 0xdc00 &&
      codePoint <= 0xdfff
    ) {
      byteLength += 3;
    } else if (codePoint <= 0x7f) {
      byteLength += 1;
    } else if (codePoint <= 0x7ff) {
      byteLength += 2;
    } else {
      byteLength += 3;
    }
  }

  return byteLength;
}

export const registerUserSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(
        50,
        "Username must be at most 50 characters",
      ),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email")
      .max(
        255,
        "Email must be at most 255 characters",
      )
      .transform((value) =>
        value.trim().toLowerCase(),
      ),

    password: z
      .string()
      .min(1, "Password is required")
      .min(
        8,
        "Password must be at least 8 characters",
      )
      .refine(
        (value) =>
          getUtf8ByteLength(value) <= 72,
        "Password must be at most 72 UTF-8 bytes",
      ),

    confirmPassword: z
      .string()
      .min(
        1,
        "Please confirm your password",
      ),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email")
    .max(
      255,
      "Email must be at most 255 characters",
    )
    .transform((value) =>
      value.trim().toLowerCase(),
    ),

  password: z
    .string()
    .min(1, "Password is required")
    .refine(
      (value) =>
        getUtf8ByteLength(value) <= 72,
      "Password must be at most 72 UTF-8 bytes",
    ),
});
export type RegisterUserInput = z.infer<
  typeof registerUserSchema
>;