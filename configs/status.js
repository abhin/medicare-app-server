export const ACTIVE = { id: 1, name: "Active" };
export const INACTIVE = { id: 2, name: "Inactive" };
export const BLOCKED = { id: 3, name: "Blocked" };
export const BOOKED = { id: 3, name: "Booked" };

export default {
  [FEMALE.id]: { ...FEMALE },
  [MALE.id]: { ...MALE },
  [OTHERS.id]: { ...OTHERS },
};
