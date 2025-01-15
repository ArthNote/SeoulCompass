export type FavoriteType = {
  id: string;
  itemId: string;
  userId: string;
  name: string;
  description: string;
  module: "tourism" | "job" | "business" | "student_resource";
  type: string;
  address: string;
  createdAt: string;
};

export interface FavoriteInterface {
  id: string;
  itemId: string;
  userId: string;
  name: string;
  description: string;
  module: "tourism" | "job" | "business" | "student_resource";
  type: string;
  address: string;
  createdAt: string;
}
