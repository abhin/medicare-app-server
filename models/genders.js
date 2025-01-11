export const FEMALE = { id: 1, name: "Female" };
export const MALE = { id: 2, name: "Male" };
export const OTHERS = { id: 3, name: "Others" };

export default {
  [FEMALE.id]: { ...FEMALE },
  [MALE.id]: { ...MALE },
  [OTHERS.id]: { ...OTHERS },
};
