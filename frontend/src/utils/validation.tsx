export function isValidEmail(email:string) {
    return /\S+@\S+\.\S+/.test(email);
  }
  
  export function isValidPassword(pass:string) {
    return /^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])/.test(pass);
  }
  
  export function isValidPhone(phone:string) {
    return /^[789]\d{9,9}$/.test(phone);
  }
  
  export const isValidDate = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  };
  
