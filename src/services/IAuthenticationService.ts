import { LoginRequest, RegisterRequest } from "../requests";


export interface IAuthenticationService {

    login(request: LoginRequest): void;

}
