export interface IEarnSummaryReport {
  data: IEarnSummaryReportData;
  meta: Meta;
}

export interface IEarnSummaryReportData {
  pointsSalePurchaseData: PointsSalePurchaseData[];
  summary: Summary;
}

export interface PointsSalePurchaseData {
  startDate: string;
  endDate: string;
  salesPurchase: string;
  pointsConversion: string;
  salesPurchasePoints: string;
}

export interface Summary {
  totalSalePurchase: string;
}

export interface Meta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IEarnDetailReport {
  data: IEarnDetailReportData[];
  meta: Meta;
}

export interface IEarnDetailReportData {
  id: string;
  user: string;
  startDate: string;
  endDate: string;
  salesPurchase: string;
  manualSurveyPoints: string;
  pointsConversion: string;
  salesPurchasePoints: number;
}

export interface IRedemptionReport {
  data: IRedemptionReportData[];
  meta: Meta;
}

export interface IRedemptionReportData {
  startDate: string;
  endDate: string;
  salesPurchase: string;
  pointsConversion: string;
  totalPoints: string;
  unusedPoints: string;
  redeemPoints: string;
  averagePoints: string;
}

export interface IRedemptionDetailReport {
  data: IRedemptionDetailReportData[];
  meta: Meta;
}

export interface IRedemptionDetailReportData {
  id: string;
  user: string;
  startDate: string;
  endDate: string;
  salesPurchase: string;
  manualSurveyPoints: string;
  salesPurchasePoints: number;
  redeemPoints: string;
  totalPoints: string;
  unusedPoints: string;
}
