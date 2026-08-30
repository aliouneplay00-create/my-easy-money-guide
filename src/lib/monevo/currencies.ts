export type Currency = {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
};

export const CURRENCIES: Currency[] = [
  { code: "XOF", symbol: "F CFA", name: "Franc CFA (UEMOA)", decimals: 0 },
  { code: "XAF", symbol: "FCFA", name: "Franc CFA (CEMAC)", decimals: 0 },
  { code: "EUR", symbol: "€", name: "Euro", decimals: 2 },
  { code: "USD", symbol: "$", name: "Dollar américain", decimals: 2 },
  { code: "GBP", symbol: "£", name: "Livre sterling", decimals: 2 },
  { code: "CAD", symbol: "$ CA", name: "Dollar canadien", decimals: 2 },
  { code: "CHF", symbol: "CHF", name: "Franc suisse", decimals: 2 },
  { code: "MAD", symbol: "DH", name: "Dirham marocain", decimals: 2 },
  { code: "DZD", symbol: "DA", name: "Dinar algérien", decimals: 2 },
  { code: "TND", symbol: "DT", name: "Dinar tunisien", decimals: 3 },
  { code: "NGN", symbol: "₦", name: "Naira nigérian", decimals: 2 },
  { code: "GHS", symbol: "₵", name: "Cedi ghanéen", decimals: 2 },
  { code: "KES", symbol: "KSh", name: "Shilling kényan", decimals: 2 },
  { code: "ZAR", symbol: "R", name: "Rand sud-africain", decimals: 2 },
  { code: "EGP", symbol: "E£", name: "Livre égyptienne", decimals: 2 },
  { code: "AUD", symbol: "$ AU", name: "Dollar australien", decimals: 2 },
  { code: "JPY", symbol: "¥", name: "Yen japonais", decimals: 0 },
  { code: "CNY", symbol: "¥", name: "Yuan chinois", decimals: 2 },
  { code: "INR", symbol: "₹", name: "Roupie indienne", decimals: 2 },
  { code: "BRL", symbol: "R$", name: "Réal brésilien", decimals: 2 },
  { code: "MXN", symbol: "$ MX", name: "Peso mexicain", decimals: 2 },
  { code: "SEK", symbol: "kr", name: "Couronne suédoise", decimals: 2 },
  { code: "NOK", symbol: "kr", name: "Couronne norvégienne", decimals: 2 },
  { code: "DKK", symbol: "kr", name: "Couronne danoise", decimals: 2 },
  { code: "PLN", symbol: "zł", name: "Zloty polonais", decimals: 2 },
  { code: "TRY", symbol: "₺", name: "Livre turque", decimals: 2 },
  { code: "AED", symbol: "د.إ", name: "Dirham des Émirats", decimals: 2 },
  { code: "SAR", symbol: "﷼", name: "Riyal saoudien", decimals: 2 },
  { code: "HTG", symbol: "G", name: "Gourde haïtienne", decimals: 2 },
];

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[2]!;
}
