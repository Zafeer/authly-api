import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@providers/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { USER_CONFLICT } from '@constants/errors.constants';
import { User, Roles } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { email: 'test@example.com' } as any;
      const user = { id: '1', email: 'test@example.com' } as User;

      (prismaService.user.findFirst as jest.Mock).mockReturnValueOnce(null);
      (prismaService.user.create as jest.Mock).mockReturnValueOnce(user);

      expect(await service.create(createUserDto)).toEqual(user);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });

    it('should throw a ConflictException if user already exists', async () => {
      const createUserDto = { email: 'test@example.com' } as any;
      const user = { id: '1', email: 'test@example.com' } as User;

      (prismaService.user.findFirst as jest.Mock).mockReturnValueOnce(user);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException(USER_CONFLICT),
      );
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      // expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', email: 'test@example.com' }] as User[];

      (prismaService.user.findMany as jest.Mock).mockReturnValueOnce(users);

      expect(await service.findAll()).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: {},
      });
    });

    it('should return an array of users with specific roles', async () => {
      const users = [{ id: '1', email: 'test@example.com' }] as User[];
      const roles = [Roles.ADMIN];

      (prismaService.user.findMany as jest.Mock).mockReturnValueOnce(users);

      expect(await service.findAll(roles)).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: { roles: { hasSome: roles } },
      });
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;

      (prismaService.user.findFirst as jest.Mock).mockReturnValueOnce(user);

      expect(await service.findOne('1')).toEqual(user);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if user is not found', async () => {
      (prismaService.user.findFirst as jest.Mock).mockReturnValueOnce(null);

      expect(await service.findOne('1')).toBeNull();
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update a user and return the user without password', async () => {
      const updateUserDto = { email: 'updated@example.com' } as UpdateUserDto;
      const user = {
        id: '1',
        email: 'updated@example.com',
        password: 'secret',
      } as User;
      const userWithoutPassword = { id: '1', email: 'updated@example.com' };

      (prismaService.user.update as jest.Mock).mockReturnValueOnce(user);

      expect(await service.update('1', updateUserDto)).toEqual(
        userWithoutPassword,
      );
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateUserDto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;

      (prismaService.user.findFirst as jest.Mock).mockReturnValueOnce(user);
      (prismaService.user.delete as jest.Mock).mockReturnValueOnce(user);

      await service.delete('1');
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      (prismaService.user.findFirst as jest.Mock).mockReturnValueOnce(null);

      await expect(service.delete('1')).rejects.toThrow(
        new NotFoundException('User not found'),
      );
      // expect(prismaService.user.findFirst).toHaveBeenCalledWith({
      //   where: { id: '1' },
      // });
      // expect(prismaService.user.delete).not.toHaveBeenCalled();
    });
  });
});
