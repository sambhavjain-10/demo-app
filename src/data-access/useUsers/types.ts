import type { UserType } from "@/types/global";

export type UserSummary = {
  id: string;
  first_name: UserType["first_name"];
  team: UserType["team"];
};

export type UsersResponse = UserSummary[];
