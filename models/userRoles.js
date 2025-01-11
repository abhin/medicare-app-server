export const USER_ROLE_ADMIN = { id: 100, name: "Admin" };
export const USER_ROLE_PATIENT = { id: 1, name: "Patient" };
export const USER_ROLE_DOCTOR = { id: 2, name: "Doctor" };

export default {
    [USER_ROLE_PATIENT.id]: {...USER_ROLE_PATIENT},
    [USER_ROLE_DOCTOR.id]: {...USER_ROLE_DOCTOR}
};
