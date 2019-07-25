import { AuthenticationRequestDTO, AuthenticationResponseDTO } from "../../dtos";

export interface IAuthenticationService {

    authenticate(request: AuthenticationRequestDTO): Promise<AuthenticationResponseDTO>;

    areValidCredentials(email: string, password: string): Promise<boolean>;

}
