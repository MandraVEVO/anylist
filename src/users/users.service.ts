import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { throwDeprecation } from 'process';

@Injectable()

export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(signupInput: SignupInput): Promise<User> {
    
    try{
      
      const newuser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password,10)
      });
      return await this.userRepository.save(newuser);

    } catch(error){
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({email})
    } catch (error) {
      throw new NotFoundException(`User with email ${email} not found`);
      // this.handleDBErrors({
      //   code: 'error-001',
      //   detail: `${email} not found`
      // });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({id})
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found`);
      
    }
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
    if( error.code == 'error-001'){
      throw new BadRequestException(error.detail.replace('key',''));
    }
    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, please check logs');
  }
}
