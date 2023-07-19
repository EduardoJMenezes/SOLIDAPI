import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

// essa classe só tem a responsabilidade de mandar criar o usuário
// no caso ela n sabe como ele vai ser criado
// unica responsabilidade da classe é verificar se o email existe

export class CreateUserUseCase {
    constructor(
       private usersRepository: IUsersRepository, // tipo
       private mailProvider: IMailProvider,
    ) {}

    async execute(data: ICreateUserRequestDTO) {
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

        if (userAlreadyExists) {
            throw new Error("User already exists.");
        }

        const user = new User(data);

        await this.usersRepository.save(user);

        await this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email
            },
            from: {
                name: 'Equipe',
                email: 'equipe@meuapp.com'
            },
            subject: 'Seja bem-vindo',
            body: '<p>Você já pode fazer login em nossa plataforma.</p> '
        })
    }
}