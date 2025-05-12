export interface AmlInfoOptions {
  firstName: string;
  lastName: string;
  dobDay: number;
  dobMonth: number;
  dobYear: number;
  address: string;
  address2?: string | null;
  zipCode: string;
  city: string;
  state?: string | null;
  country: string;
  userId: number;
  idCountry: string;
  idType: string;
  title: string;
}
