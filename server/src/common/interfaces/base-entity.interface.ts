export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeleteEntity extends BaseEntity {
  deletedAt?: Date;
}

export interface AuditableEntity extends BaseEntity {
  createdBy?: number;
  updatedBy?: number;
}
