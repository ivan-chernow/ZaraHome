export interface IPromocode {
  id: number;
  code: string;
  discount: number;
  isActive: boolean;
  validFrom: Date;
  validTo: Date;
  maxUses: number;
  currentUses: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPromocodeUsage {
  id: number;
  promocodeId: number;
  userId: number;
  orderId: number;
  usedAt: Date;
}

export interface IPromocodeWithUsage extends IPromocode {
  usage?: IPromocodeUsage[];
}
