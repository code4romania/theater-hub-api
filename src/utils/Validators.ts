
export class Validators {

    public static isValidUUID(value: string): boolean {
        const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        return regex.test(value);
    }

    public static isValidEmail(value: string): boolean {
        value       = value.trim();
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value);
    }

    public static isValidPhone(value: string): boolean {
        const regex = /^(?=0[723][2-8]\d{7})(?!.*(.)\1{2,}).{10}$/;
        return regex.test(value);
    }

}