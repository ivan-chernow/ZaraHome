export interface RepositoryInterface<T> {
  findById(id: number): Promise<T | null>;
  findAll(options?: any): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
  save(entity: T): Promise<T>;
}
