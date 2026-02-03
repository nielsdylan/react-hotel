// export interface Paginate {
//   data: [];
//   current_page: number;
//   last_page: number;
//   total: number;
//   first_page_url: string;
//   last_page_url: string;
// }
export interface Paginate {
  data: any[]; // O el tipo de tu tarifa: Tarifa[]
  current_page: number;
  last_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  first_page_url: string;
  last_page_url: string;
  links: any[];
}
export interface Tarifa {
  id: number;
  nombre: string;
  estado: number;
}
