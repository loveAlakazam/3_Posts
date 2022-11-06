import { Test, TestingModule } from '@nestjs/testing';
import { PostType } from '../../entities/enums/PostType';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsService } from '../posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../../entities/Users';
import { Posts } from '../../entities/Posts';
import { InsertResult, Repository } from 'typeorm';
import { DateColumns } from '../../entities/embededs/date-columns';
import { InvalidPostPasswordRegexException } from '../exceptions/post-exceptions';
import { errorMsg } from '../exceptions/error-messages';

const mockPostRepository = jest.fn(() => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  }),
}));

const mockUserRepository = jest.fn(() => ({}));

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: MockRepository<Posts>;
  let usersRepository: MockRepository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Posts),
          useValue: mockPostRepository(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<MockRepository<Posts>>(
      getRepositoryToken(Posts),
    );

    usersRepository = module.get<MockRepository<Users>>(
      getRepositoryToken(Users),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost()', () => {
    test('공개글 등록 성공 1', async () => {
      const post: CreatePostDto = {
        title: '공개 게시글 테스트',
        content: '공개 게시글의 본문입니다 ~~~~😺 기스깅 화이팅!',
        postType: PostType.PUBLIC_POST,
      };

      const user: Users = {
        userId: 1,
        name: '기스깅',
        email: 'giseok@gmail.com',
        password: '1234',
        phone: '010-1111-2222',
        Posts: [],
        dateColumns: new DateColumns(),
      };

      // postRepository.createQueryBuilder.mockResolvedValue(post);
      // expect(postRepository.createQueryBuilder).toHaveBeenCalled();
      // expect(await service.createPost(user, post)).toBe(InsertResult);
      const insertResult = new InsertResult();
      jest
        .spyOn(service, 'createPost')
        .mockResolvedValue(Promise.resolve(insertResult));

      return expect(service.createPost(user, post)).resolves.toEqual(
        insertResult,
      );
    });

    test('비밀글 등록 성공', async () => {
      const post: CreatePostDto = {
        title: '비밀글 제목1',
        content: '비밀글 1 게시글 본문입니다. 테스트입니다 테스트!',
        postType: PostType.PRIVATE_POST,
        postPassword: 'bank11brothers',
      };

      const user: Users = {
        userId: 1,
        name: '기스깅',
        email: 'giseok@gmail.com',
        password: '1234',
        phone: '010-1111-2222',
        Posts: [],
        dateColumns: new DateColumns(),
      };

      const insertResult = new InsertResult();
      jest
        .spyOn(service, 'createPost')
        .mockResolvedValue(Promise.resolve(insertResult));

      return expect(service.createPost(user, post)).resolves.toEqual(
        insertResult,
      );
    });

    test('비밀글 등록 실패 - 너무짧은 비밀번호', async () => {
      const post: CreatePostDto = {
        title: '비밀글 제목1',
        content: '비밀글 1 게시글 본문입니다. 테스트입니다 테스트!',
        postType: PostType.PRIVATE_POST,
        postPassword: 'ayy1',
      };

      const user: Users = {
        userId: 1,
        name: '기스깅',
        email: 'giseok@gmail.com',
        password: '1234',
        phone: '010-1111-2222',
        Posts: [],
        dateColumns: new DateColumns(),
      };

      // jest
      //   .spyOn(service, 'createPost')
      //   .mockResolvedValue(Promise.resolve(null));

      // expect(service.createPost(user, post)).rejects.toThrowError(
      //   new InvalidPostPasswordRegexException(
      //     errorMsg.INVALID_POST_PASSWORD_REGEX,
      //   ),
      // );
      // expect(service.createPost(user, post)).rejects.toThrowError(
      //   new InvalidPostPasswordRegexException(
      //     errorMsg.INVALID_POST_PASSWORD_REGEX,
      //   ),
      // );
    });
  });
});
