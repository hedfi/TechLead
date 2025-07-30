/**
 * Generic repository interface that defines common CRUD operations
 */
export interface IBaseRepository<T, ID> {
  /**
   * Find entity by ID
   */
  findById(id: ID): Promise<T | null>;
  
  /**
   * Find all entities
   */
  findAll(): Promise<T[]>;
  
  /**
   * Create a new entity
   */
  create(data: Partial<T>): Promise<T>;
  
  /**
   * Update an existing entity
   */
  update(id: ID, data: Partial<T>): Promise<boolean>;
  
  /**
   * Delete an entity
   */
  delete(id: ID): Promise<boolean>;
}