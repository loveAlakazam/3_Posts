// 최소 한개의 숫자 + 영문숫자조합 + 최소6자 이상
export const PRIVATE_PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const EMAIL_REGEX = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]\/g/;
export const PHONE_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
