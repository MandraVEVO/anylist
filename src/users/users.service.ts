import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()

export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(signupInput: SignupInput): Promise<User> {
    
    try{
      const newUser = this.userRepository.create(signupInput);
      return await this.userRepository.save(newUser);

    } catch(error){
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: string): Promise<User> {
    throw new Error(`Method not implemented. ID: ${id}`);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`Method not implemented. ID: ${id}`);
  }

  private handleDBErrors(error: any ): never{

    if( error.code == '23505'){
      throw new BadRequestException(error.detail.replace('key',''));
    }
    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, please check logs');
  }
}
