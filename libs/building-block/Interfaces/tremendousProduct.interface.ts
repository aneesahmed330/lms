export interface ITremendousProduct {
  id: string;
  name: string;
  currency_codes: string[];
  skus: Sku[];
  countries: Country[];
  category: string;
  disclosure: string;
  description: string;
  images: Image[];
}

export interface Sku {
  min: number;
  max: number;
}

export interface Country {
  abbr: string;
}

export interface Image {
  src: string;
  type: string;
}
