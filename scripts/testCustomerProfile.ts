// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isValidEmail, isValidPhone, isStrongPassword, sanitizeText } = require("@/utils/validation");

type Customer = {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address?: string;
};

const mockUsers: { customers: Customer[] } = {
  customers: [
    {
      id: "1",
      email: "musteri@test.com",
      password: "123456",
      name: "Ahmet Yılmaz",
      phone: "+90 555 123 4567",
      address: "Kadıköy, İstanbul",
    },
  ],
};

const tests: Array<{ name: string; run: () => boolean }> = [
  { name: "sanitize trims and collapses spaces", run: () => sanitizeText("  Ahmet   Yılmaz  ") === "Ahmet Yılmaz" },
  { name: "valid email passes", run: () => isValidEmail("test@example.com") },
  { name: "invalid email fails", run: () => !isValidEmail("invalid@") },
  { name: "valid phone passes", run: () => isValidPhone("+90 555 123 4567") },
  { name: "invalid phone fails", run: () => !isValidPhone("12345") },
  { name: "strong password passes", run: () => isStrongPassword("abc123") },
  { name: "weak password fails", run: () => !isStrongPassword("abc") },
  {
    name: "mock customer password updates",
    run: () => {
      const customer = { ...mockUsers.customers[0] };
      const idx = mockUsers.customers.findIndex((c: Customer) => c.id === customer.id);
      const newPwd = "Yeni123";
      if (idx === -1) return false;
      (mockUsers.customers as any)[idx].password = newPwd;
      return (mockUsers.customers as any)[idx].password === newPwd;
    },
  },
];

let passed = 0;
for (const t of tests) {
  const ok = t.run();
  if (ok) {
    passed++;
    console.log(`✓ ${t.name}`);
  } else {
    console.error(`✗ ${t.name}`);
  }
}

if (passed !== tests.length) {
  process.exitCode = 1;
  console.error(`Failed: ${tests.length - passed}/${tests.length}`);
} else {
  console.log(`All passed: ${passed}/${tests.length}`);
}
