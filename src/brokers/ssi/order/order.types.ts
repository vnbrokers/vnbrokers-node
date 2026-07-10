export interface SSIOrderPlaceResponse {
  status: number;
  message: string;
  data: {
    orderId: string;
    requestID: string;
  };
}

export interface SSIOrderRaw {
  orderId: string;
  account: string;
  symbol: string;
  side: 'NB' | 'NS'; // Nb = buy, NS = sell theo ký hiệu SSI
  orderType: 'LO' | 'MP' | 'ATO' | 'ATC';
  quantity: number;
  price: number;
  filledQuantity: number;
  avgFillPrice?: number;
  orderStatus: 'WA' | 'PF' | 'FF' | 'CL' | 'RJ'; // Wait/PartialFill/FullFill/Cancel/Reject
  createdDate: string; // ISO string
  modifiedDate: string;
}

export interface SSIListResponse<T> {
  status: number;
  message: string;
  data: T[];
}
