const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'winston@example.com',
  password: '123456',
};

const mockUser2 = {
  email: 'kevin@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('items', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST /api/v1/todos creates a new shopping item with the current user', async () => {
    const [agent, user] = await registerAndLogin();

    const resp = await agent.post('/api/v1/todos')
      .send({
        todo: 'buy milk',
        user_id: user.id,
      });
      console.log(resp.body);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      todo: 'buy milk',
      user_id: user.id,
      completed: false,
    });
  });

  afterAll(() => {
    pool.end();
  });
});
